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
async function specToClassPropertyWithcomments( classSpecObj ) {
	// Get the various config values, with defaults
	const { name, type, _humanLabel, _assistantLabel } = normalizeSpecObj( classSpecObj );

	// We need the class spec prefix (to use later)
	const classPrefix = fullSpecPrefix( classSpecObj );

	// Lets get the minified base code
	const minifiedBaseCode = await specToMinifiedBaseCode( classSpecObj );

	// Get the property declaration
	let propertyDeclaration = await codeExtraction(minifiedBaseCode, `${type} code`, "all property declarations");

	// Lets perform a g2 pass
	const fullPrompt = [
		classPrefix,
		"",
		`The following is the various property declaration for the ${name} class / interface`,
		"",
		"```",
		propertyDeclaration,
		"```",
		"",
		`${_humanLabel}:`,
		`Add comments to the ${name} property declarations.`,
		"Return the property declarations with comments.",
		"",
		`${_assistantLabel}:`,
		"```",
		""
	].join("\n");

	// Generate it
	return removeSuffixIfPresent( await cachedCompletion(fullPrompt, cachePath( classSpecObj, "SpecClassProperty")), "```");
}
module.exports = specToClassPropertyWithcomments;