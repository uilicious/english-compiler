//--------------------------------------------------
// Dependencies
//--------------------------------------------------

const cachedCompletion = require("../openai/cachedCompletion");
const normalizeSpecObj = require("./promptParts/normalizeSpecObj")
const removeSuffixIfPresent = require("./promptParts/removeSuffixIfPresent")
const fullSpecPrefix = require("./promptParts/fullSpecPrefix")
const cachePath = require("./promptParts/cachePath")

//--------------------------------------------------
// Implementation
//--------------------------------------------------

/**
 * Given the following parameter in the specObj
 * 
 * @param {Object} specObj to use
 * @param {String} instruction to execute using the spec
 * @param {String} cacheCategory to use for jsonl caching
 * 
 * @return Generated code string, wrapped in a promise
 */
async function specExtraction( specObj, instruction, cacheCategory = "SpecExtraction", replyWithinQuote = true ) {
	// Get the various config values, with defaults
    const { _humanLabel, _assistantLabel } = normalizeSpecObj(specObj);

	// The prompt to use
	let fullPrompt = [
		fullSpecPrefix( specObj ),
		"",
		`${_humanLabel}:`,
		`${instruction}`,
		"",
		`${_assistantLabel}:`,
		(replyWithinQuote? "```\n":""),
	].join("\n")

	// Generate it
	let rep = await cachedCompletion(fullPrompt, cachePath(specObj, cacheCategory));
	if( replyWithinQuote ) {
		return removeSuffixIfPresent(rep, "```");
	} else {
		return rep;
	}
}
module.exports = specExtraction;