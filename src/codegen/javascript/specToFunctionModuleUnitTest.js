//--------------------------------------------------
// Dependencies
//--------------------------------------------------

const config = require("../../core/config");
const path = require("path");
const normalizeSpecObj = require("../promptParts/normalizeSpecObj");
const specExtraction = require("../segment/specExtraction");

//--------------------------------------------------
// Implementation
//--------------------------------------------------

/**
 * Given the JS spec obj, generate the full JS module
 * 
 * @param {Object} specObj object representing the JS module
 * 
 * @return Fully generated code
 */
async function specToFunctionModuleUnitTest( specObj ) {
	// Get the various config values, with defaults
	const { _pLang } = normalizeSpecObj( specObj );

	// Get the code file, and test file path, currently only JS should be supported
	let subPath = specObj.namespace.split(".").join("/")+"/"+specObj.name;
	let codeFilePath = path.join(config.code_dir, subPath+".js");
	let testFilePath = path.join(config.test_dir, subPath+".test.js");

	// Get the g1 minified code
	let g1_codegen = await specExtraction( 
		specObj, 
		[
			`The code relative to the test file, will be at: `+path.relative(testFilePath, codeFilePath),
			`Please generate the ${_pLang} module unit test file, with multiple scenerios, according to the spec`,
			`Use the assert library for the test`
		].join("\n"),
		"FunctionModuleCodegen"
	);
	
	return g1_codegen;
}
module.exports = specToFunctionModuleUnitTest;