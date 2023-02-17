/**
 * Given the input text, trim the suffix if its present
 * @param {String} text 
 * @param {String} suffix 
 * @returns 
 */
module.exports = function removeSuffixIfPresent(text, suffix = "```") {
	text = text.trim();
	
	// Sometimes it has the suffix
	if( text.endsWith(suffix) ) {
		return text.slice(0, -suffix.length).trim()
	} 
	// Sometimes it reduces the suffix by 1 character
	if( text.endsWith(suffix.slice(-1)) ) {
		return text.slice(0, -(suffix.length-1)).trim()
	} 

	// Sometimes it dun
	return text.trim();
}