//--------------------------------------------------
// Dependencies
//--------------------------------------------------

const cachedCompletion = require("../openai/cachedCompletion");

//--------------------------------------------------
// Implmentation
//--------------------------------------------------

/**
 * Simplified question and answer prompt interface
 * With a misc cache
 * 
 * @param {String} prompt 
 * @returns {String}
 */
async function promptAndAnswer( prompt ) {
	return await cachedCompletion( prompt, "misc/promptAndAnswer.jsonl" )
}

// Export the module
module.exports = promptAndAnswer;

//--------------------------------------------------
// Direct execution
//--------------------------------------------------

// Special direct execution handling
// https://stackoverflow.com/questions/6398196/detect-if-called-through-require-or-directly-by-command-line
if( require.main === module ) {
	(async function() {

		// Argument check
		const reqPrompt = process.argv[2];
		if( reqPrompt == null ) {
			console.error( "[ERROR] Missing request prompt as first argument" );
			console.error( `[ERROR] Example: node ${ process.argv[1] } "Explain large language models"` );
			process.exit(1);
		}

		// Response
		const resp = await promptAndAnswer(reqPrompt);
		console.log(resp);
	})();
}