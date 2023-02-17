//--------------------------------------------------
// Dependencies
//--------------------------------------------------

const cachedCompletion = require("../../openai/cachedCompletion");
const blockWrapper = require("../promptParts/blockWrapper")
const normalizeSpecObj = require("../promptParts/normalizeSpecObj")
const removeSuffixIfPresent = require("../promptParts/removeSuffixIfPresent")
const cachePath = require("../promptParts/cachePath");
const specToCodeClassSkeleton = require("./specToCodeClassSkeleton");
const methodSpecToCodeSet = require("./methodSpecToCodeSet");
const codeExtraction = require("./codeExtraction");
const codeConversion = require("./codeConversion");
const indentString = require("../../util/indentString");
const specToMinifiedBaseCode = require("./specToMinifiedBaseCode");
const fullSpecPrefix = require("../promptParts/fullSpecPrefix");

//--------------------------------------------------
// Implementation
//--------------------------------------------------

/**
 * Given the class spec, and method spec. Generate the class comment block
 * 
 * @param {Object} classSpecObj object representing the classSpec
 * 
 * @return Fully generated code
 */
async function specToClassCommentBlock( classSpecObj ) {
	// Get the various config values, with defaults
	const { name, type, _humanLabel, _assistantLabel } = normalizeSpecObj( classSpecObj );

	// We need the class spec prefix (to use later)
	const classPrefix = fullSpecPrefix( classSpecObj );

	// Lets get the minified base code
	const minifiedBaseCode = await specToMinifiedBaseCode( classSpecObj );

	// Because the "spec" can grow to be too excessively verbose,
	// we perform a comment first pass, using the minified code base
	const g1_prompt = [
		`${_humanLabel}:`,
		`For the following ${type} minified code`,
		"",
		blockWrapper(`${type} code`, minifiedBaseCode),
		"",
		`Please generate the ${name} class top level comment, as a comment block like the following`,
		"",
		"```",
		"/**",
		" * Detailed class comment here",
		" */",
		"```",
		"",
		"Return only the comment block.",
		"",
		`${_assistantLabel}:`,
		"```",
		""
	].join("\n");
	
	// Generate it
	const g1_result = removeSuffixIfPresent( await cachedCompletion(g1_prompt, cachePath( classSpecObj, "SpecClassCommentG1")), "```");

	// Lets perform a g2 pass
	const g2_prompt = [
		classPrefix,
		"",
		`The following is the comment block segment for the ${name} class / interface`,
		"",
		"```",
		g1_result,
		"```",
		"",
		`${_humanLabel}:`,
		`Improve the ${name} comment block.`,
		"To better explain the class/interface purpose, and how it should be used.",
		"While improving the overall readability, grammer and spelling in the process.",
		"",
		"Focus only on the summary, avoid adding uneeded implementation notes, or method/property/constructor specific details",
		`Include explaination on how to use the ${name}, such as its use cases, and its usage flows, when possible.`,
		"",
		"Do not include details of the properties, constructor and methods, as that will be documented seperately",
		"Do not include the implementaiton notes in the class top level comments.",
		"",
		"Return only the comment block.",
		"",
		`${_assistantLabel}:`,
		"```",
		""
	].join("\n");

	// Generate it
	const g2_result = removeSuffixIfPresent( await cachedCompletion(g2_prompt, cachePath( classSpecObj, "SpecClassCommentG2")), "```");

	// Lets perform a g2 pass
	const g3_prompt = [
		`The following is the comment block segment for the ${name} class / interface`,
		"",
		"```",
		g2_result,
		"```",
		"",
		`${_humanLabel}:`,
		`Please rewrite the ${name} comment block, for improved readability.`,
		// `If explaination is done for a sequence of steps please ensure it is done in point form`,
		"",
		"Return only the comment block.",
		"",
		`${_assistantLabel}:`,
		"```",
		""
	].join("\n");

	// Generate it
	const g3_result = removeSuffixIfPresent( await cachedCompletion(g3_prompt, cachePath( classSpecObj, "SpecClassCommentG3")), "```");

	// Return it
	return g3_result;
}
module.exports = specToClassCommentBlock;