//--------------------------------------------------
// Dependencies
//--------------------------------------------------

const cachedCompletion = require("../../openai/cachedCompletion")
const blockWrapper = require("../promptParts/blockWrapper")
const removeSuffixIfPresent = require("../promptParts/removeSuffixIfPresent")
const normalizeSpecObj = require("../promptParts/normalizeSpecObj")
const cachePath = require("../promptParts/cachePath")

//--------------------------------------------------
// Implementation
//--------------------------------------------------

/**
 * Given the following code, convert from one format to another
 * @param {String} code to convert 
 * @param {String} specObj, if not set the code will be treated as an ambigious snippet
 * @returns 
 */
 async function codeMinify( code, specObj = { name: "VariousSnippet", type: "snippet" } ) {

	// Get the various config values, with defaults
    // used to build the cacheKey
    const { type, name, cacheMode } = normalizeSpecObj(specObj);
    
	// Textual description in block wrapper
	const codeBlock = blockWrapper(`${type} code`, code);

	// The prompt to use
	let fullPrompt = [
        `Convert the following ${type} code`,
        "",
        codeBlock,
        "",
        `To its minified code version, without any comments. Including class, parameter, todo or method comments.`,
        "",
        "```",
        ""
	].join("\n")

	// Generate it
	let resp = await cachedCompletion(fullPrompt, cachePath( specObj, "CodeMinify" ));

	// Remove the ending "```"
	return removeSuffixIfPresent(resp, "```");
}

module.exports = codeMinify;