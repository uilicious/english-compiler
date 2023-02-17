//--------------------------------------------------
// Dependencies
//--------------------------------------------------

const cachedCompletion = require("../../openai/cachedCompletion");
const blockWrapper = require("../promptParts/blockWrapper")
const normalizeSpecObj = require("../promptParts/normalizeSpecObj")
const removeSuffixIfPresent = require("../promptParts/removeSuffixIfPresent")
const fullSpecPrefix = require("../promptParts/fullSpecPrefix")
const cachePath = require("../promptParts/cachePath")

//--------------------------------------------------
// Implementation
//--------------------------------------------------

/**
 * Given the following parameter in the config
 * 
 * @param {Object} config 
 * @param {String} question, which is wrapped inside a block (avoid contextual confusion)
 * 
 * @return Generate an answer from the given question
 */
async function specQuestionAndAnswer( config, question ) {

	// Get the various config values, with defaults
    const { type, spec, _humanLabel, _assistantLabel } = normalizeSpecObj(config);

	// Textual description in block wrapper
	const questionBlock = blockWrapper("Question", question);

	// The prompt to use
	let fullPrompt = [
		fullSpecPrefix( config ),
		"",
		`${_humanLabel}:`,
		`Please answer the question in the following block`,
		"",
		questionBlock,
		"",
		`${_assistantLabel}:`,
		""
	].join("\n")

	// Generate and return it
	return await cachedCompletion(fullPrompt, cachePath(config, "SpecQuestionAndAnswer"));
}
module.exports = specQuestionAndAnswer;