//--------------------------------------------------
// Dependencies
//--------------------------------------------------

const parseMD = require('parse-md').default
const fs = require("fs");
const path = require('path');
const specChangeUsingFeedback = require('./segment/specChangeUsingFeedback');

//--------------------------------------------------
// Implementation
//--------------------------------------------------

/**
 * Given the markdown details, generate the full code file
 * 
 * @param {String} filePath for the full markdown file
 * 
 * @return Generated code string, wrapped in a promise
 */
async function markdownSpecFileChangeWithFeedback( filePath, aiSuggestion, userFeedback, prgCallbck = function() {}  ) {
	// Read the file, and split out the metadata + content
	let fullFileData = await fs.promises.readFile( filePath, "utf8" );
	let { metadata, content } = parseMD(fullFileData);

	// Guess the name if not set, from the first segment of the filename
	metadata.name = metadata.name || path.basename( filePath ).split(".")[0];
	metadata.spec = content;

	// Forward it to the actual function that processes it
	return await specChangeUsingFeedback( metadata, aiSuggestion, userFeedback );
}
module.exports = markdownSpecFileChangeWithFeedback;
