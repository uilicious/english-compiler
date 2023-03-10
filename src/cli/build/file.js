//---------------------------------------------------
//
//  Dependencies
//
//---------------------------------------------------

const OutputHandler = require("../OutputHandler");
const getSpecFile = require("../util/getSpecFile");
const inquirer = require('inquirer');
const getMarkdownObj = require("../../util/getMarkdownObj");
const diff = require("diff")
const fs = require("fs");
const markdownSpecFileToCode = require("../../codegen/markdownSpecFileToCode");
const path = require("path");
const config = require("../../core/config");
const personalityRemark = require("../../codegen/personalityRemark");

//---------------------------------------------------
//
//  Command Definition
//
//---------------------------------------------------

module.exports = {
	
	aliases: ["file <specfile>"],
	paramsDesc: ["specification file to build"],
	desc: "Given the specification file, build the respective code",
	
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

			const relativePath = path.relative( path.resolve( config.spec_dir ), fullpath );

			// Build the Subpath, relative to all varients, without file type
			const relativePathParse = path.parse(relativePath);
			// We remove the last trailing .spec from the filename, as that is not part of the "filetype"
			const subPath = relativePathParse.dir + "/" +relativePathParse.name.split(".").slice(0,-1).join(".");

			OutputHandler.standardGreen(`[System] Generating code from spec file: ${fullpath}`)
			if( config.personality ) {
				const remark = await personalityRemark(fullpath, config.personality, "Building a single code file");
				OutputHandler.standardGreen(`[AI Remark] ${remark}`)
			}

			// Generate the code
			const generatedCode = await markdownSpecFileToCode(fullpath);
            
			// The path for the code, and test file output
			let codeFilePath = null;
			let testFilePath = null;

			// Handle according to language
			if( generatedCode.lang == "javascript" ) {
				codeFilePath = path.join( path.resolve(config.code_dir), subPath+".js" );
				testFilePath = path.join( path.resolve(config.test_dir), subPath+".test.js");
			} else if( generatedCode.lang == "java" ) {
				codeFilePath = path.join( path.resolve(config.code_dir), subPath+".java" );
				// testFilePath = path.join( path.resolve(config.test_dir), subPath+".test.java");
			} else if( generatedCode.lang == "html" ) {
				codeFilePath = path.join( path.resolve(config.code_dir), subPath+".html" );
				// testFilePath = path.join( path.resolve(config.test_dir), subPath+".test.java");
			}

			// Lets write the file accordingly
			OutputHandler.standardGreen("[AI] Writing source file :"+codeFilePath);
			await fs.promises.mkdir( path.dirname(codeFilePath), { recursive: true } );
			await fs.promises.writeFile(codeFilePath, generatedCode.code, "utf8");
            
			if( generatedCode.test ) {
				OutputHandler.standardGreen("[AI] Writing test file :"+testFilePath);
				await fs.promises.mkdir( path.dirname(testFilePath), { recursive: true } );
				await fs.promises.writeFile(testFilePath, generatedCode.test, "utf8");
			}

			if( config.personality ) {
				const remark = await personalityRemark(fullpath, config.personality, "Complete building a single code file");
				OutputHandler.standardGreen(`[AI Remark] ${remark}`)
			}
		} catch(err) {
			OutputHandler.fatalError(err, 51);
		}
	}
}