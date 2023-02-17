const path = require("path")
const ConfigLoader = require("@js-util/config-loader")

//
// Load the various config files (if found),
// along with the various default value fallbacks
//
const cwd = process.cwd();
const config = new ConfigLoader({
	fileList: [
        path.resolve(cwd,"./config.json"),
        path.resolve(cwd,"./config.jsonc"),
        "./config.json", 
        "./config.jsonc",

        path.resolve(cwd,"./english-compiler.json"),
        path.resolve(cwd,"./english-compiler.jsonc"),
        "./english-compiler.json", 
        "./english-compiler.jsonc"
    ],
	default: {

        // Openai API key
        "openai_apikey": null,

        // Prompt caching dir, this can also be used to build up a historical dataset
        "prompt_cache_dir": null,

        // Specification directory
        "spec_dir": "./spec",

        // Source code output directory
        "code_dir": "./src",

        // Test code output directory
        "test_dir": "./test",

        // Add some personality based remarks
        "personality": false
    }
});

// Export the config
module.exports = config;