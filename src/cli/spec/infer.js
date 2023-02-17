//---------------------------------------------------
//  Dependencies
//---------------------------------------------------

const markdownSpecFileSuggestion = require("../../codegen/markdownSpecFileSuggestion");
const OutputHandler = require("../OutputHandler");
const getSpecFile = require("../util/getSpecFile");
const inquirer = require('inquirer');
const markdownSpecFileChangeWithFeedback = require("../../codegen/markdownSpecFileChangeWithFeedback");
const getMarkdownObj = require("../../util/getMarkdownObj");
const diff = require("diff")
const fs = require("fs")

//---------------------------------------------------
//  Command Definition
//---------------------------------------------------

module.exports = {
	
	aliases: ["infer <specfile>"],
	paramsDesc: ["specification file to make changes"],
	desc: "Sometimes you want to start with code, its alright. Lets update the specs accordingly",
	
	setup: (cmd) => {
		// No additional argument required
	},
	
	// Execute the run command
	run: async (argv, context) => {
		try {
			const specFile = argv.specfile;
			const fullpath = await getSpecFile(specFile);
			
			if( fullpath == null ) {
				OutputHandler.fatalError(`Missing valid spec file path : ${specFile}`, 44);
				return;
			}
			const originalMd = await getMarkdownObj( fullpath );
			
			OutputHandler.standardGreen("### ---")
			OutputHandler.standardGreen("### Generating AI suggestions for spec file (using code file) ... ")
			OutputHandler.standardGreen("### "+fullpath);
			OutputHandler.standardGreen("### ---")

			// @TODO
			
		} catch(err) {
			OutputHandler.fatalError(err, 51);
		}
	}
}