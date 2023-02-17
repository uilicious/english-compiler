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
 * @param {String} from stated type
 * @param {String} to target type
 * @param {String} specObj, if not set the code will be treated as an ambigious snippet
 * @returns 
 */
 async function codeConversion( code, from, to, specObj = { name: "VariousSnippet", type: "snippet" } ) {

	// Get the various config values, with defaults
    // used to build the cacheKey
    const { type, name, cacheMode } = normalizeSpecObj(specObj);
    
	// Textual description in block wrapper
	const codeBlock = blockWrapper(`${from}`, code);

	// The prompt to use
	let fullPrompt = [
        `Convert the following`,
        "",
        codeBlock,
        "",
        `To ${to}`,
        "",
        "```",
        ""
	].join("\n")

	// Generate it
	let resp = await cachedCompletion(fullPrompt, cachePath( specObj, "CodeConv" ));

	// Remove the ending "```"
	return removeSuffixIfPresent(resp, "```");
}

module.exports = codeConversion;