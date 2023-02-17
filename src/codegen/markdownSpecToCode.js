//--------------------------------------------------
// Dependencies
//--------------------------------------------------

const normalizeSpecObj = require("./promptParts/normalizeSpecObj")
const specToFullClassCode = require("./prototype/specToFullClassCode");
const specToFunctionModule = require("./javascript/specToFunctionModule");
const specToFunctionModuleUnitTest = require("./javascript/specToFunctionModuleUnitTest");
const specToCodeFile = require("./html/specToCodeFile");

//--------------------------------------------------
// Implementation
//--------------------------------------------------

/**
 * Given the markdown details, generate the full code file
 * 
 * @param {Object} specObj, this is typyically the metadata involved
 * @param {String} mdStr, full markdown file containing the given class spec
 * 
 * @return Generated code string, wrapped in a promise
 */
async function markdownSpecToCode( specObj, mdStr, prgCallbck = function() {}  ) {
	// Safety check on specObj, we require at minimum type, and name
	if( specObj == null || specObj.name == null || specObj.type == null ) {
		console.warn([
			"Missing valid markdown specification metadata, at minimum it should include name, and type for example : ",
			"---",
			"type: java",
			"name: ClassName",
			"namespace: package.namespace",
			"---"
		].join("\n"))
		throw "Missing valid specification metadata, see console logs for example format";
	}

	// Get the various config values, with defaults
    const { type, _pLang, _subType } = normalizeSpecObj(specObj);

	// Lets first embed the mdStr, as a spec, field
	specObj.spec = mdStr;

	// Perform conversion according to language type
	if( _pLang == "java" ) {
		// Lets generate the full class code
		return {
			code: await specToFullClassCode( specObj, {} ),
			test: null, //@TODO (not supported now),
			lang: _pLang,
			type: _subType
		}
	} else if( _pLang == "javascript" ) {
		let ret = {
			code: await specToFunctionModule( specObj, prgCallbck ),
			test: null, // ,
			lang: _pLang,
			type: _subType
		}

		if( specObj.test ) {
			ret.test = await specToFunctionModuleUnitTest( specObj, prgCallbck )
		}
		return ret;
	} else if ( _pLang == "html" ) {
		let ret = {
			code: await specToCodeFile( specObj, prgCallbck ),
			test: null, // ,
			lang: _pLang,
			type: _subType
		}
		return ret;
	}

	// Throw for unsupported language
	throw "Unsupported language type / file type : "+_pLang+" / "+_subType;
}
module.exports = markdownSpecToCode;
