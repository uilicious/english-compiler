//--------------------------------------------------
// Dependencies
//--------------------------------------------------

const normalizeSpecObj = require("../promptParts/normalizeSpecObj")
const cachedCompletion = require("../../openai/cachedCompletion")
const fullSpecPrefix = require("../promptParts/fullSpecPrefix")
const cachePath = require("../promptParts/cachePath")

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
 * @return Generate the suggested changes to be done by the assistant
 */
 async function specChangeSuggestion( config ) {
	// Get the various config values, with defaults
    const {  _humanLabel, _assistantLabel } = normalizeSpecObj(config);
    
	// The prompt to use
	let fullPrompt = [
		fullSpecPrefix( config ),
		"",
		`${_humanLabel}:`,
		`Please suggest changes, to improve the specification. In point form.`,
		`Reply with NO_SUGGESTION if there is no suggested changes, to improve the specification.`,
		"",
		`${_assistantLabel}:`,
        ""
	].join("\n")

	// Generate and return the response
	return await cachedCompletion(fullPrompt, cachePath(config, `SpecChangeSuggestion`));
}

module.exports = specChangeSuggestion;