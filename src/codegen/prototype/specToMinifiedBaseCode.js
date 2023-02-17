//--------------------------------------------------
// Dependencies
//--------------------------------------------------

const cachedCompletion = require("../../openai/cachedCompletion");
const blockWrapper = require("../promptParts/blockWrapper")
const normalizeSpecObj = require("../promptParts/normalizeSpecObj")
const removeSuffixIfPresent = require("../promptParts/removeSuffixIfPresent")
const fullSpecPrefix = require("../promptParts/fullSpecPrefix")
const cachePath = require("../promptParts/cachePath");
const codeMinify = require("./codeMinify");
const getTokenCount = require("../../openai/getTokenCount");

//--------------------------------------------------
// Implementation
//--------------------------------------------------

/**
 * Given the following parameter in the config
 * 
 * - type : Programming language (eg. java, javascript)
 * - name : Name of the class to generate
 * - namespace : package namespace of the class
 * - spec : Detailed textual description describing the class
 * 
 * @param {Object} config 
 * 
 * @return Generated code string, wrapped in a promise
 */
async function specToMinifiedBaseCode( classSpec ) {

	// Get the various config values, with defaults
    const { name, type, _humanLabel, _assistantLabel, _pLang } = normalizeSpecObj(classSpec);

	// We intentionally generate the code through multiple rounds.
	// As it improves the overall code quality, via encouraging the 
	// AI to perform "chain of thought" in the process.
	// ----

	// The prompt to use
	let g1_prompt = [
		fullSpecPrefix( classSpec ),
		"",
		`${_humanLabel}:`,
		`Please generate the ${_pLang} code, with the minimum implementation according the spec. Minified without any comments, or code indentation.`,
		"",
		`${_assistantLabel}:`,
		"```",
		""
	].join("\n")

	// Generate it
	let g1_codegen = removeSuffixIfPresent(await cachedCompletion(g1_prompt, cachePath(classSpec, "MinifiedBaseCodeG1")), "```");

	// Token length safety
	if( getTokenCount(g1_codegen) > 2000 ) {
		throw "[[Token Limit Error]] Gen 1 draft of the unminified base code, exceeds a 2,000 tokens - consider reducing and splitting the class : "+name;
	}

	// Unfortunately, there is a non zero chance that the code output is not 100% minified, so we need to do a minify pass
	let g1_minified = await codeMinify(g1_codegen, classSpec);

	// Token length safety
	if( getTokenCount(g1_minified) > 1000 ) {
		throw "[[Token Limit Error]] Gen 1 draft of the minified base code, exceeds a 1,000 tokens - consider reducing and splitting the class : "+name;
	}

	// Lets do a second pass
	let g2_prompt = [
		g1_prompt+g1_minified,
		"```",
		"",
		`${_humanLabel}:`,
		`Please improve the ${type} code, completing any missing implementation that is requied. And fixing any obvious errors.`,
		`Keep the output as minified ${type} code, without spaces, or code indentation.`,
		"",
		`${_assistantLabel}:`,
		"```",
		""
	].join("\n")

	// Generate it
	let g2_codegen = removeSuffixIfPresent(await cachedCompletion(g2_prompt, cachePath(classSpec, "MinifiedBaseCodeG2")), "```");

	// Token length safety
	if( getTokenCount(g2_codegen) > 2000 ) {
		throw "[[Token Limit Error]] Gen 2 draft of the unminified base code, exceeds a 2,000 tokens - consider reducing and splitting the class : "+name;
	}
	
	// Unfortunately (again), there is a non zero chance that the code output is not 100% minified, so we need to do a minify pass
	let g2_minified = await codeMinify(g2_codegen, classSpec);

	// Token length safety
	if( getTokenCount(g2_minified) > 1000 ) {
		throw "[[Token Limit Error]] Gen 2 draft of the minified base code, exceeds a 1,000 tokens - consider reducing and splitting the class : "+name;
	}
	return g2_minified;
}
module.exports = specToMinifiedBaseCode;