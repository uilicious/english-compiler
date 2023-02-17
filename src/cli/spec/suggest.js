//---------------------------------------------------
//
//  Dependencies
//
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
//
//  Command Definition
//
//---------------------------------------------------

module.exports = {
	
	aliases: ["suggest <specfile>"],
	paramsDesc: ["specification file to suggest changes"],
	desc: "Given the specification file path, suggest changes to be made",
	
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
			
			OutputHandler.standardGreen("### ---")
			OutputHandler.standardGreen("### Generating AI suggestions for spec file ... ")
			OutputHandler.standardGreen("### "+fullpath);
			OutputHandler.standardGreen("### ---")
			
			const suggestion = await markdownSpecFileSuggestion( fullpath );
			OutputHandler.standard(suggestion);
			
			OutputHandler.standardGreen("### ---")
			OutputHandler.standardGreen("### Please provide instructions, on what changes would you like ... ")
			OutputHandler.standardGreen("### ---")
			
			const promptRes = await inquirer.prompt([
				{ name:"instruction", default: "Apply all the suggested changes" }
			]);

			const instruction = promptRes.instruction;
			OutputHandler.standardGreen("### ---")
			OutputHandler.standardGreen("### Computing changes ... ")
			OutputHandler.standardGreen("### ---")
			
			const originalMd = await getMarkdownObj( fullpath );
			const updatedSpec = await markdownSpecFileChangeWithFeedback( fullpath, suggestion, instruction );

			const changeDelta = diff.diffLines(originalMd.content, updatedSpec);
			for(const segment of changeDelta) {
				if( segment.removed ) {
					OutputHandler.standardRed(segment.value.trim());
				} else if( segment.added ) {
					OutputHandler.standardGreen(segment.value.trim());
				} else {
					OutputHandler.standard(segment.value.trim());
				}
			}

			OutputHandler.standardGreen("### ---")
			OutputHandler.standardGreen("### Would you like to apply the above changes? ")
			OutputHandler.standardGreen("### ---")
			
			const confirmRes = (await inquirer.prompt([
				{ name:"apply", default:false, type:"confirm" }
			])).apply;

			if( confirmRes ) {
				await fs.promises.writeFile( fullpath, originalMd.frontmatter+updatedSpec );
			}
		} catch(err) {
			OutputHandler.fatalError(err, 51);
		}
	}
}