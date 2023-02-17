const getAgentLabels = require("./getAgentLabels")

/**
 * Normalize a specification object, type, name, namespace, and spec values to sane defaults.
 * 
 * @param {*} config 
 * @returns 
 */
module.exports = function normalizeSpecObj( config ) {
	// Check self reference cache
	if( config._cacheObj && config._cacheObj.self == config) {
		return config;
	}

	// Get the various config values, with defaults
	config.name = (config.name || "HelloWorld").trim();
	config.namespace = (config.namespace || "").trim();
	config.spec = (config.spec || "Example hello world class, which echos 'hello world' when initialized.").trim();

	// Cache flag used to indicate its a private codegen, and should not be saved within the prompt history cache
	config.cacheMode = (config.cacheMode || "public").trim();

	// Get the type
	let type    = (config.type || "java").trim().toLowerCase();
	config.type = type;

	// Get the programming language
	let _pLang    = type.split(" ")[0];
	config._pLang   = _pLang;

	// And the module type
	let _subType  = type.slice(_pLang.length).trim();
	if( _subType == null || _subType == "") {
		_subType = "class";
	}
	config._subType = _subType;
	
	// Add useful labels for internal use
	const { human, assistant } = getAgentLabels(config);
	config._humanLabel = human;
	config._assistantLabel = assistant;

	// Handle language specific default
	if( _pLang == "javascript" ) {
		config.moduleType = (config.moduleType || "CJS").toUpperCase()
		config.docType = (config.docType || "JSDoc")
	} else if( _pLang == "java" ) {
		config.docType = (config.docType || "JavaDoc")
	}

	// Caching object, used to cache multiple sub operaitons
	config._cacheObj = config._cacheObj || {};

	// Cache ownself
	config._cacheObj.self = config;

	// And return it
	return config;
}