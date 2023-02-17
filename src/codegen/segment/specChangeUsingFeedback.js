//--------------------------------------------------
// Dependencies
//--------------------------------------------------

const cachedCompletion = require("../../openai/cachedCompletion")
const blockWrapper = require("../promptParts/blockWrapper")
const removeSuffixIfPresent = require("../promptParts/removeSuffixIfPresent")
const normalizeSpecObj = require("../promptParts/normalizeSpecObj")
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
 async function specChangeUsingFeedback( config, assistantSuggestion, feedback ) {

	// Throw on empty feedback
	if( feedback == null || (feedback = feedback.trim()) == "" ) {
		throw "Unexpected empty feedback to apply"
	}

	// Get the various config values, with defaults
    const { spec, _humanLabel, _assistantLabel } = normalizeSpecObj(config);
    
	// Textual description in block wrapper
	const desc = blockWrapper("Textual description", spec);

	// Assistant suggestion block
	let assistantSuggestionBlock = "";
	if( assistantSuggestion && (assistantSuggestion = assistantSuggestion.trim()) != "") {
		assistantSuggestionBlock = [
			`Please suggest changes which can be made by you, as an AI assistant, to improve the textual description. In point form.`,
			`Along with seperate set of changes I as the programmer should make to improve the textual description. In point form.`,
			"Note that implementation specific details of individual method/functions, will be described in a seperate document, and is not needed in the class textual description.",
			`Reply with NO_SUGGESTION if there is no suggested changes the assistant can perform`,
			"",
			`${_assistantLabel}:`,
			assistantSuggestion,
			"",
			`${_humanLabel}:`,
		].join("\n");
	}

	// Textual description in block wrapper
	const feedbackBlock = blockWrapper("Feedback", feedback);

	// The prompt to use
	let fullPrompt = [
		fullSpecPrefix( config ),
		"",
		`${_humanLabel}:`,
		assistantSuggestionBlock,
        "Make changes and return the textual description, based on the following feedback.",
		"",
		feedbackBlock,
		"",
		`${_assistantLabel}:`,
		"```",
		""
	].join("\n")

	// Generate it
	let resp = await cachedCompletion(fullPrompt, cachePath( config, "SpecChangeUsingFeedback"));

	// Remove the ending "```"
	return removeSuffixIfPresent(resp, "```")

	// // Or throw an error (and warning) accordingly
	// console.warn([
	// 	"## ERROR DETAILS :: incomplete textual description block",
	// 	resp
	// ].join("\n"));
	// throw "Unexpected INCOMPLETE textual description changes (see warning logs for its output)"
}

module.exports = specChangeUsingFeedback;