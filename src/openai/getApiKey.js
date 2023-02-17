// Get the API key
const openai_apikey = require("../core/config").openai_apikey;

// Safety check
if(openai_apikey == null) {
    throw "Missing valid `openai_apikey`, please ensure that the code-ai config.jsonc is setup with it"
}

// Export
module.exports = openai_apikey;