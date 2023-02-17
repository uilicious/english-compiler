//--------------------------------------------------
// Dependencies
//--------------------------------------------------

const cachedCompletion = require("../../openai/cachedCompletion");
const blockWrapper = require("../promptParts/blockWrapper")
const normalizeSpecObj = require("../promptParts/normalizeSpecObj")
const removeSuffixIfPresent = require("../promptParts/removeSuffixIfPresent")
const fullSpecPrefix = require("../promptParts/fullSpecPrefix")
const cachePath = require("../promptParts/cachePath")

// Various sequential steps
const specToCodeClassSkeleton = require("./specToCodeClassSkeleton");
const codeMinify = require("./codeMinify");
const specToMinifiedBaseCode = require("./specToMinifiedBaseCode");

//--------------------------------------------------
// Implementation
//--------------------------------------------------

/**
 * Given the class config, and the method set, 
 * return the method code implementation, 
 * and the depencies that would need to be included
 * 
 * Note that this depends heavily on multiple substeps
 * 
 * @param {Object} classConfig 
 * @param {String} methodName
 * @param {String} methodSpec
 * 
 * @return Generated code string, wrapped in a promise
 */
async function methodSpecToCodeSet( classConfig, methodName, methodSpec = "" ) {
	// Get the various config values, with defaults
    const { type, _humanLabel, _assistantLabel } = normalizeSpecObj(classConfig);

	// Lets do the big sequence, hopefully the cache's hold up
	const minifiedBaseCode = await specToMinifiedBaseCode( classConfig );

	// Common prompt prefix
	const prefix_prompt = [
		fullSpecPrefix( classConfig ),
		"",
		blockWrapper("The following is the incomplete minified code, of the current incomplete implementation", minifiedBaseCode),
		"",
		(methodSpec.length > 0)? blockWrapper(`The following is the textual description for the '${methodName}' method (or methods if overloaded)`, methodSpec) : ""
	]

	// The first round prompt to use - to do the first draft as minified code
	// this multi step process is intentional, as it improves the overall code quality,
	// via encouraging the AI to perform "chain of thought" in the process.
	const g1_prompt = [
		prefix_prompt,
		"",
		`${_humanLabel}:`,
		`Please generate the ${type} code for the '${methodName}' method, minified, without comments`,
		"",
		`${_assistantLabel}:`,
		"```",
		""
	].join("\n");

	// Generate the generation 1 code
	const g1_codegen = removeSuffixIfPresent( await cachedCompletion(g1_prompt, cachePath(classConfig, "MethodCodeG1")), "```");
	
	// Ok we got the G1 code, now lets do G2
	const g2_prompt = [
		// Since g1 prompt already ends with \n
		g1_prompt + g1_codegen,
		"```",
		"",
		`${_humanLabel}:`,
		`Please improve the code. Improve readability. Fix any potential bugs, and handle edge cases. While simplifying and reducing the number of code steps and lines involved if possible.`,
		"",
		`${_assistantLabel}:`,
		"```",
		""
	].join("\n")

	// Generate the generation 2 code
	const g2_codegen = removeSuffixIfPresent( await cachedCompletion(g2_prompt, cachePath(classConfig, "MethodCodeG2")), "```");
	
	// Ok we got the G2 code, now lets do G3
	const g3_prompt = [
		prefix_prompt,
		"",
		`${_humanLabel}:`,
		`Please generate the ${type} code for the '${methodName}' method`,
		"",
		`${_assistantLabel}:`,
		"```",
		g2_codegen,
		"```",
		"",
		`${_humanLabel}:`,
		`Please improve the code, and add code comments, including detailed documentation comment for the method.`,
		"While simplifying and reducing the number of code steps and lines involved if possible.",
		"Avoid any code comment inside the method, if the comment is redundant.",
		"",
		`${_assistantLabel}:`,
		"```",
		""
	].join("\n")

	// Generate the generation 2 code
	const g3_codegen = removeSuffixIfPresent( await cachedCompletion(g3_prompt, cachePath(classConfig, "MethodCodeG3")), "```");
	
	// Ok, lets get the dependency statements fetching
	const dep_prompt = [
		prefix_prompt,
		"",
		`${_humanLabel}:`,
		`Please generate the ${type} code for the '${methodName}' method, with detailed documentations and comments`,
		"",
		g3_codegen,
		"```",
		"",
		`${_humanLabel}:`,
		`Please list any required package or namespace dependencies used by the '${methodName}' method, as import statements, without comments.`,
		`Do not include dependencies, if it was not used inside the '${methodName}' method, or already declared in the code skeleton.`,
		`You may return NO_DEPENDENCIES if there is no additional dependencies`,
		"",
		`${_assistantLabel}:`,
		"```",
		""
	].join("\n")
	// Generate the generation 2 code
	let dep_codegen = removeSuffixIfPresent( await cachedCompletion(dep_prompt, cachePath(classConfig, "MethodCodeDep")), "```").trim();
	if( dep_codegen == "NO_DEPENDENCIES" ) {
		dep_codegen = "";
	}

	// Return it as a pair
	return {
		codegen: g3_codegen,
		dependencies: dep_codegen
	}
}
module.exports = methodSpecToCodeSet;