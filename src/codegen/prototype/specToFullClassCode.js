//--------------------------------------------------
// Dependencies
//--------------------------------------------------

const cachedCompletion = require("../../openai/cachedCompletion");
const blockWrapper = require("../promptParts/blockWrapper")
const normalizeSpecObj = require("../promptParts/normalizeSpecObj")
const removeSuffixIfPresent = require("../promptParts/removeSuffixIfPresent")
const fullSpecPrefix = require("../promptParts/fullSpecPrefix")
const cachePath = require("../promptParts/cachePath");
const specToCodeClassSkeleton = require("./specToCodeClassSkeleton");
const methodSpecToCodeSet = require("./methodSpecToCodeSet");
const codeExtraction = require("./codeExtraction");
const codeConversion = require("./codeConversion");
const indentString = require("../../util/indentString");
const specToMinifiedBaseCode = require("./specToMinifiedBaseCode");
const specToClassCommentBlock = require("./specToClassCommentBlock");
const specToClassPropertyWithcomments = require("./specToClassPropertyWithComments");

//--------------------------------------------------
// Implementation
//--------------------------------------------------

/**
 * Given the class spec, and method spec. Generate the full code
 * 
 * @param {Object} classSpecObj object representing the classSpec
 * @param {Object} methodSpecMap an object map of individual methodSpec's
 * 
 * @return Fully generated code
 */
async function specToFullClassCode( classSpecObj, methodSpecMap = {} ) {
	// Get the various config values, with defaults
	const { name, type, _humanLabel, _assistantLabel } = normalizeSpecObj( classSpecObj );

	// Lets get the minified base code
	const minifiedBaseCode = await specToMinifiedBaseCode( classSpecObj );

	// Method list
	let methodList = JSON.parse( await codeExtraction(minifiedBaseCode, `${type} code`, "list of method names (including the constructor), without the parameters or brackets. As a JSON array. If there is a class constructor, return it as the first item", classSpecObj) );

	// Method codegen set map
	let methodCodeSetMap = {};

	// If method name matches class name, rewrite it as "constructor"
	for( let i=0; i<methodList.length; ++i ) {
		let methodName = methodList[i];
		if( methodName == name ) {
			methodList[i] = "constructor";
		}
	}
	const hasConstructor = methodList.indexOf("constructor") >= 0;

	// For each method,
	// Lets compute the detailed implementtation of each component with comments
	for( let methodName of methodList ) {
		// We get the methodSpec with a safety check, as the method could be using a reserved keyword, and not have a spec defined
		let methodSpec =  methodSpecMap[methodName] || "";
		if( !(typeof methodSpec === 'string' || methodSpec instanceof String) ) {
			methodSpec = "";
		}

		// Use the spec
		methodCodeSetMap[ methodName ] = await methodSpecToCodeSet( classSpecObj, methodName, methodSpec );
	}

	// Segment extraction
	let packageNamespaceAndDependecies = await codeExtraction(minifiedBaseCode, `${type} code`, "Package namespace (if any), and all the dependencies declarations (if any), return only as package and import statements");
	let openingClassDeclaration = await codeExtraction(minifiedBaseCode, `${type} code`, "class declaration line, excluding the opening bracket '{', excluding dependencies, excluding methods and properties, excluding closing bracket '}'");
	let classBlockComment = await specToClassCommentBlock(classSpecObj);
	let propertyDeclarationWithComments = await specToClassPropertyWithcomments(classSpecObj);

	// Lets merge the dependencies
	for( const methodName of methodList ) {
		packageNamespaceAndDependecies += "\n" + methodCodeSetMap[ methodName ].dependencies;
	}

	// Lets remove duplicates & lets start building the full code toget
	let fullCode = await codeExtraction(
		packageNamespaceAndDependecies, 
		`${type} snippet code, containing package namespace (if any) and dependencies declaration`, 
		"Package namespace (if any), and all the dependencies declarations, with any duplicates removed, and redundant blank lines removed.", 
		classSpecObj
	);

	// Lets add in the opening
	fullCode += "\n\n"+classBlockComment;
	fullCode += "\n"+openingClassDeclaration + " {\n";

	// The various properties
	if( propertyDeclarationWithComments.trim().length > 1 ) {
		fullCode += "\n	//"
		fullCode += "\n	// Properties"
		fullCode += "\n	//\n"
		fullCode += "\n" + indentString(propertyDeclarationWithComments, 1, "	") + "\n";    
	}

	// And the constructor
	if( methodList.length > 0 ) {

		if( hasConstructor ) {
			fullCode += "\n	//"
			fullCode += "\n	// Constructor"
			fullCode += "\n	//\n"
			fullCode += "\n" + indentString(methodCodeSetMap[ "constructor" ].codegen, 1, "	") + "\n";
		}
	
		fullCode += "\n	//"
		fullCode += "\n	// Method implementation"
		fullCode += "\n	//\n"
	
		// Lets add each part of the methods
		for( const methodName of methodList ) {
			if( methodName == "constructor" ) {
				continue;
			}
			fullCode += "\n" + indentString(methodCodeSetMap[ methodName ].codegen, 1, "	") + "\n";
		}
	
	}

	// Add the closing bracket
	fullCode += "\n"+"}";

	// Return the full code
	return fullCode;
}
module.exports = specToFullClassCode;