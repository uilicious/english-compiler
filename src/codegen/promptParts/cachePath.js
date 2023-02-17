//--------------------------------------------------
// Dependencies
//--------------------------------------------------

const normalizeSpecObj = require("./normalizeSpecObj")

//--------------------------------------------------
// Implementation
//--------------------------------------------------

/**
 * Compute the jsonl file path to use, given the specObj, and operation type
 * 
 * While taking into account the cacheMode.
 * Returns null, if not public / private
 * 
 * @param {*} specObj 
 * @param {*} opType 
 * 
 * @return File path as a string
 */
module.exports = function cachePath( specObj, opType ) {
	// Get the various config values, with defaults
    // used to build the cacheKey
    const { type, name, cacheMode, _pLang } = normalizeSpecObj(specObj);

    // Remove whitespaces, using dash
    // const typeWithDash = type.replace(/ /g, "-");
    const fPath = `codegen/${_pLang}/${opType}.${name}.jsonl`;
    
    if( cacheMode == "public" ) {
        return fPath
    } else if( cacheMode == "private" ) {
        return ".private/"+fPath;
    }

    return null;
}