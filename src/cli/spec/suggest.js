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
const fs = require("fs");
const config = require("../../core/config");
const personalityRemark = require("../../codegen/personalityRemark");

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
			
			OutputHandler.standardGreen("[System] Generating AI suggestions for spec file : "+fullpath)
			
			const suggestion = await markdownSpecFileSuggestion( fullpath );
			OutputHandler.standard(`[AI Suggestions]\n${suggestion}`);
			
			if( config.personality ) {
				const remark = await personalityRemark(fullpath, config.personality, "Awaiting for instructions, on how to improve the spec file");
				OutputHandler.standardGreen(`[AI Remark] ${remark}`)
			}
			OutputHandler.standardGreen("[System] Please provide instructions, on what changes would you like ... ")
			
			const promptRes = await inquirer.prompt([
				{ name:"instruction", default: "Apply all the suggested changes" }
			]);

			const instruction = promptRes.instruction;

			OutputHandler.standardGreen("[System] Computing changes ... ")
			if( config.personality ) {
				const remark = await personalityRemark(fullpath, config.personality, `Comment on the following instructions provided '${instruction}'`);
				OutputHandler.standardGreen(`[AI Remark] ${remark}`)
			} 
			
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

			OutputHandler.standardGreen("[System] Would you like to apply the above changes? ")
			
			const confirmRes = (await inquirer.prompt([
				{ name:"apply", default:false, type:"confirm" }
			])).apply;

			if( config.personality ) {
				const remark = await personalityRemark(fullpath, config.personality, `Provide commentry, about completing '${instruction}'`);
				OutputHandler.standardGreen(`[AI Remark] ${remark}`)
			} 

			if( confirmRes ) {
				await fs.promises.writeFile( fullpath, originalMd.frontmatter+"\n"+updatedSpec );
			}
		} catch(err) {
			OutputHandler.fatalError(err, 51);
		}
	}
}