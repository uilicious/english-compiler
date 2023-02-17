//--------------------------------------------------
// Dependencies
//--------------------------------------------------

const cachedCompletion = require("../../openai/cachedCompletion");
const cachePath = require("../promptParts/cachePath");
const fullSpecPrefix = require("../promptParts/fullSpecPrefix");
const normalizeSpecObj = require("../promptParts/normalizeSpecObj");
const removeSuffixIfPresent = require("../promptParts/removeSuffixIfPresent");

//--------------------------------------------------
// Implementation
//--------------------------------------------------

/**
 * Given the JS spec obj, generate the full JS module
 * 
 * @param {Object} specObj object representing the JS module
 * @param {Function} prgCallbck function, used to log the various incremental status
 * 
 * @return Fully generated code
 */
async function specToCodeFile( specObj, prgCallbck = function() {} ) {
	// Get the various config values, with defaults
	const { _pLang, _humanLabel, _assistantLabel } = normalizeSpecObj( specObj );

	// Full spec prefix
	const specPrefix = fullSpecPrefix( specObj );

	// Perform the Gen1 codegen
	prgCallbck(`FunctionModuleCodegen for '${specObj.name}' (Gen1)`);
	const g1_prompt = [
		specPrefix, 
		"",
		`${_humanLabel}:`,
		`Please generate the ${_pLang} code, with the complete implementation according the spec. Without comments.`,
		"",
		`${_assistantLabel}:`,
		"```",
		""
	].join("\n")
	const g1_codegen = removeSuffixIfPresent( await cachedCompletion(g1_prompt, cachePath(specObj, "FunctionModuleCodegen")), "```");

	// Perform the Gen2 codegen
	prgCallbck(`FunctionModuleCodegen for '${specObj.name}' (Gen2)`);
	const g2_prompt = [
		// Since g1 prompt already ends with \n
		g1_prompt + g1_codegen,
		"```",
		"",
		`${_humanLabel}:`,
		`Please improve the code. Improve readability.`,
		`Fix any potential bugs, and handle edge cases.`,
		`While simplifying and reducing the number of code steps and lines involved if possible.`,
		"",
		`${_assistantLabel}:`,
		"```",
		""
	].join("\n")
	const g2_codegen = removeSuffixIfPresent( await cachedCompletion(g2_prompt, cachePath(specObj, "FunctionModuleCodegen")), "```");
	
	// Return gen 2 result
	return g2_codegen;
	
	// // Perform Gen3 codegen
	// prgCallbck(`FunctionModuleCodegen for '${specObj.name}' (Gen3)`);
	// const g3_prompt = [
	// 	specPrefix,
	// 	"",
	// 	`${_humanLabel}:`,
	// 	`Please generate the ${_pLang} code`,
	// 	"",
	// 	`${_assistantLabel}:`,
	// 	"```",
	// 	g2_codegen,
	// 	"```",
	// 	"",
	// 	`${_humanLabel}:`,
	// 	`Please improve the code, and add code comments, including detailed documentation for all functions.`,
	// 	"Simplifying and reducing the number of code steps and lines involved if possible.",
	// 	"Add code comment inside the function, to describe the process.",
	// 	"",
	// 	`${_assistantLabel}:`,
	// 	"```",
	// 	""
	// ].join("\n");
	// const g3_codegen = removeSuffixIfPresent( await cachedCompletion(g3_prompt, cachePath(specObj, "FunctionModuleCodegen")), "```");
	
	// // Perform Gen4 codegen
	// prgCallbck(`FunctionModuleCodegen for '${specObj.name}' (Gen4)`);
	// const g4_prompt = [
	// 	specPrefix,
	// 	"",
	// 	`${_humanLabel}:`,
	// 	`Please generate the ${_pLang} code`,
	// 	"",
	// 	`${_assistantLabel}:`,
	// 	"```",
	// 	g2_codegen,
	// 	"```",
	// 	"",
	// 	`${_humanLabel}:`,
	// 	`Please improve overall readability of the code, and add code comments.`,
	// 	"",
	// 	`${_assistantLabel}:`,
	// 	"```",
	// 	""
	// ].join("\n");
	// const g4_codegen = removeSuffixIfPresent( await cachedCompletion(g3_prompt, cachePath(specObj, "FunctionModuleCodegen")), "```");
	
	// // Return gen 4 result
	// return g4_codegen;
}
module.exports = specToCodeFile;