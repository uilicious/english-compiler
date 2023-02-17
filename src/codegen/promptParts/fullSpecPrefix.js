//--------------------------------------------------
// Dependencies
//--------------------------------------------------

const getTokenCount = require("../../openai/getTokenCount");
const blockWrapper = require("./blockWrapper")
const normalizeSpecObj = require("./normalizeSpecObj")

//--------------------------------------------------
// Implementation
//--------------------------------------------------

/**
 * Generate the full opening prompt, which describes the current code specification. 
 * Excluding the opening "human:" prompt.
 * 
 * Given the following parameter in the class specObj
 * 
 * - type : Programming language (eg. java, javascript)
 * - name : Name of the class to generate
 * - namespace : package namespace of the class
 * - spec : Detailed textual description describing the class
 * 
 * @param {Object} specObj 
 * 
 * @return Generate the suggested changes to be done by the assistant
 */
function fullSpecPrefix( specObj ) {

	// Get the various specObj values, with defaults
    const { _pLang, _subType, name, spec, namespace } = normalizeSpecObj(specObj);
    
	// The prompt to use
	// PS: We use tabs > spaces to reduce token count !!!
	let promptPrefixArr = [
		`Code indentation should be done with tabs (unless minified).`,
		`The ${_pLang} ${_subType} can be described with the following details`,
		"",
		`${_subType} name: ${name}`,
	];

	// Add the language specific stuff
	if( _pLang == "java" ) {
		if (namespace.length > 0) {
			promptPrefixArr.push(`Package Namespace: ${specObj.namespace}`);
		}
	} else if( _pLang == "javascript" ) {
		promptPrefixArr.push(`Module Type: ${specObj.moduleType}`);
	}

	// Add doctype (if set)
	if( specObj.docType ) {
		promptPrefixArr.push(`Documentation Style: ${specObj.docType}`);
	}

	// Textual description in block wrapper
	const desc = blockWrapper(`${_subType} textual description`, spec);
	promptPrefixArr.push("");
	promptPrefixArr.push(desc);

	// Build the full prefix
	let promptPrefix = promptPrefixArr.join('\n');

	// Token length safety
	if( getTokenCount(promptPrefix) > 1500 ) {
		throw "[[Token Limit Error]] Class specification is too large, reduce the main class specification description for : "+name;
	}

	// Return the full prompt prefix
    return promptPrefix;
}

module.exports = fullSpecPrefix;