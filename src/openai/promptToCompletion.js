/**
 * The following script is used to ask a prompt, and return its response
 * 
 * This does not perform any caching / saving, and can be imported, or executed directly
 * 
 * ```
 * node ./promptToCompletion.js "getting-started/Writing-your-first-test"
 * ```
 **/

// Load dependency modules, and keys
const fetch = require("node-fetch");
const openai_key = require("./getApiKey");
const GPT3Tokenizer = require('gpt3-tokenizer').default;

// Default config settings to use
const defaultConfig = {
	"model": "text-davinci-003",
	"temperature": 0,
	"max_tokens": "auto",
	"top_p": 1,
	"frequency_penalty": 0,
	"presence_penalty": 0,
	"best_of": 1,

	// Important note!: we split the endoftext token very
	// intentionally,to avoid causing issues when this file is parsed
	// by GPT-3 based AI.

	// Default stop keyword
	"stop": ["<|"+"endoftext"+"|>"],

	// Default prompt
	"prompt": "<|"+"endoftext"+"|>",

	// Return as a string if false, 
	// else return the raw openAI API response
	"rawApi": false
};

// Initialize the tokenizer
const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });

/**
 * Given the prompt config, return the API result
 * 
 * @param {String | Object} inConfig, containing the prompt or other properties
 * 
 * @return {Sring | Object} completion string, if rawApi == false (default), else return the raw API JSON response
 */
async function promptToCompletion(inConfig) {
	// Normalzied string prompt to object
	if (typeof inConfig === 'string' || inConfig instanceof String) {
		inConfig = { prompt: inConfig };
	}

	// Join it together
	let reqJson = Object.assign({}, defaultConfig, inConfig);

	// Extract and remove internal props
	let useRawApi = reqJson.rawApi || false;
	delete reqJson.rawApi;

	// Normalize "max_tokens" auto
	if( reqJson.max_tokens == "auto" ) {
		let tokenObj = tokenizer.encode( reqJson.prompt );
		reqJson.max_tokens = 4000 - tokenObj.bpe.length;
		if( reqJson.max_tokens < 50 ) {
			throw "Prompt is too large for auto mode, total prompt token size is : "+tokenObj.bpe.length;
		}
	}

	// The return data to use
	let respJson = null;
	let respErr = null;

	// Retry mechanic, for handling request errors
	for(let tries=0; tries < 3; ++tries) {
		try {
			// Perform the JSON request
			const resp = await fetch('https://api.openai.com/v1/completions', {
				method: 'post',
				body: JSON.stringify(reqJson),
				headers: {
					'Content-Type': 'application/json',
					"Authorization": `Bearer ${openai_key}`
				}
			});
			respJson = await resp.json();
	
			// Check for response
			if( respJson.choices && respJson.choices[0] && respJson.choices[0].text ) {
				// Return the JSON as it is
				if( useRawApi ) {
					return respJson;
				}
	
				// Return the completion in simple mode
				return respJson.choices[0].text.trim();
			}
		} catch(e) {
			respErr = e;
		}
	}

	// Handle unexpected response
	if( respErr ) {
		console.warn([
			"## Unable to handle prompt for ...",
			JSON.stringify(reqJson),
			"## Recieved error ...",
			respErr
		].join("\n"));
	} else {
		console.warn([
			"## Unable to handle prompt for ...",
			JSON.stringify(reqJson),
			"## Recieved response ...",
			JSON.stringify(respJson)
		].join("\n"));
	}
	throw Error("Missing valid openai response, please check warn logs for more details")
}

// Export the module
module.exports = promptToCompletion;

// Special direct execution handling
// https://stackoverflow.com/questions/6398196/detect-if-called-through-require-or-directly-by-command-line
if( require.main === module ) {
	(async function() {

		// Argument check
		const reqPrompt = process.argv[2];
		if( reqPrompt == null ) {
			console.error( "[ERROR] Missing request prompt as first argument" );
			console.error( `[ERROR] Example: node ./promptToCompletion.js "tell me a joke?"` );
			process.exit(1);
		}

		// Response
		const resp = await promptToCompletion(reqPrompt);
		console.log(resp);
	})();
}