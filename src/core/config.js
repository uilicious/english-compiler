const path = require("path")
const ConfigLoader = require("@js-util/config-loader")

//
// Load the various config files (if found),
// along with the various default value fallbacks
//
const cwd = process.cwd();
const config = new ConfigLoader({
	fileList: [
        path.resolve(__dirname,"../../config.json"),
        path.resolve(__dirname,"../../config.jsonc"),
        path.resolve(cwd,"../../config.json"),
        path.resolve(cwd,"../../config.jsonc"),
        "./config.json", 
        "./config.jsonc"
    ],
	default: {}
});

// Export the config
module.exports = config;