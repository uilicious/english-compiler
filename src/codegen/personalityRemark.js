//--------------------------------------------------
// Dependencies
//--------------------------------------------------

const parseMD = require('parse-md').default
const fs = require("fs");
const path = require('path');
const specExtraction = require('./segment/specExtraction');

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
async function personalityRemark( filePath, personality = "Sarcastic & Sassy", remarkType = "Building the code according to the spec" ) {
	// Read the file, and split out the metadata + content
	let fullFileData = await fs.promises.readFile( filePath, "utf8" );
	let { metadata, content } = parseMD(fullFileData);

	// Guess the name if not set, from the first segment of the filename
	metadata.name = metadata.name || path.basename( filePath ).split(".")[0];
	metadata.spec = content;

	// Forward it to the actual function that processes it
	return await specExtraction( metadata, `Please provide a ${personality} remark or commentry for ${remarkType}`, "personality-remark" )
}
module.exports = personalityRemark;

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
		const resp = await personalityRemark(reqPrompt, (msg) => { console.log(`- ${msg}`)});
		console.log(resp);
	})();
}