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
 * - type : Programming language (eg. java, javascript)
 * - name : Name of the class to generate
 * - namespace : package namespace of the class
 * - spec : Detailed textual description describing the class
 * 
 * @param {Object} config 
 * 
 * @return Generated code string, wrapped in a promise
 */
async function specToCodeClassSkeleton( config ) {

	// Get the various config values, with defaults
    const { type, _humanLabel, _assistantLabel } = normalizeSpecObj(config);

	// The prompt to use
	let fullPrompt = [
		fullSpecPrefix( config ),
		"",
		`${_humanLabel}:`,
		`Please generate the ${type} code skeleton with detailed class comments, and all required dependencies, and properties. Without any of the actual constructor or function implementations`,
		"",
		`${_assistantLabel}:`,
		"```",
		""
	].join("\n")

	// Generate it
	let codegen = await cachedCompletion(fullPrompt, cachePath(config, "ClassSkeleton"));


	// `Please generate the ${type} code skeleton with comments, with any required dependencies, and properties, without any of the actual constructor or function implementations.`,
	// `Include detailed class comments, rewritten for clarity and readability.`,

	// Remove the ending "```"
	return removeSuffixIfPresent(codegen, "```")

	// // Or throw an error (and warning) accordingly
	// console.warn([
	// 	"## ERROR DETAILS :: code gen output",
	// 	codegen
	// ].join("\n"));
	// throw "Unexpected INCOMPLETE codegen without markdown code block closure (see warning logs for its output)"
}
module.exports = specToCodeClassSkeleton;