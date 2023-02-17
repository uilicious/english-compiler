//--------------------------------------------------
// Dependencies
//--------------------------------------------------

const parseMD = require('parse-md').default
const fs = require("fs");
const path = require('path');
const markdownSpecToCode = require("./markdownSpecToCode");

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
async function markdownSpecFileToCode( filePath, prgCallbck = function() {}  ) {
	// Read the file, and split out the metadata + content
	let fullFileData = await fs.promises.readFile( filePath, "utf8" );
	let { metadata, content } = parseMD(fullFileData);

	// Guess the name if not set, from the first segment of the filename
	metadata.name = metadata.name || path.basename( filePath ).split(".")[0];

	// Forward it to the actual function that processes it
	return await markdownSpecToCode( metadata, content, prgCallbck );
}
module.exports = markdownSpecFileToCode;

//--------------------------------------------------
// Direct calling support
//--------------------------------------------------

// Special direct execution handling
// https://stackoverflow.com/questions/6398196/detect-if-called-through-require-or-directly-by-command-line
if( require.main === module ) {
	(async function() {

		// Argument check
		const reqPrompt = process.argv[2];
		if( reqPrompt == null ) {
			console.error( "[ERROR] Missing request prompt as first argument" );
			console.error( `[ERROR] Example: node ${process.argv[1]} "./file/path/to/class.spec.md"` );
			process.exit(1);
		}

		// Response
		const resp = await markdownSpecFileToCode(reqPrompt, (msg) => { console.log(`- ${msg}`)});
		console.log(resp);
	})();
}