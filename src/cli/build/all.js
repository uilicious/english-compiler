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
const scanDirForFiles = require("../../util/scanDirForFiles");
const fileExist = require("../../util/fileExist");
const personalityRemark = require("../../codegen/personalityRemark");

//---------------------------------------------------
//
//  Command Definition
//
//---------------------------------------------------

module.exports = {
	
	aliases: ["all"],
	paramsDesc: [],
	desc: "Scans the specification folder, and generate all the respective code",
	
	setup: (cmd) => {
		// No additional argument required
	},
	
	// Execute the run command
	run: async (argv, context) => {
		try {
			OutputHandler.standardGreen(`[System] Generating code from spec dir : ${config.spec_dir}`)
			
            const scanList = await scanDirForFiles(config.spec_dir, [/^.*\.spec\.md$/]);
			
			if( scanList.length == 0 ) {
				OutputHandler.fatalError(`No specification files found in spec_dir : ${config.spec_dir}`, 44);
				return;
			}

			let personalityFile = null;
			if( config.personality ) {
				let personalityFile = path.resolve(config.spec_dir, "README.md");
				if( (await fileExist( personalityFile )) == false ) {
					personalityFile = scanList[0];
				}
				const remark = await personalityRemark(personalityFile, config.personality, "Building everything according to the spec");
				OutputHandler.standardGreen(`[AI Remark] ${remark}`)
			}

			for(const specFile of scanList) {

				const fullpath = await getSpecFile(specFile);
				if( fullpath == null ) {
					OutputHandler.fatalError(`Invalid spec file path : ${specFile}`, 44);
					return;
				}

				const relativePath = path.relative( path.resolve( config.spec_dir ), fullpath );

				// Build the Subpath, relative to all varients, without file type
				const relativePathParse = path.parse(relativePath);
				// We remove the last trailing .spec from the filename, as that is not part of the "filetype"
				const subPath = relativePathParse.dir + "/" +relativePathParse.name.split(".").slice(0,-1).join(".");

				OutputHandler.standard("[AI Working] Generating code from spec file: " + fullpath);

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
					// testFilePath = path.join( path.resolve(config.test_dir), subPath+".test.html");
				}

				// // Lets write the file accordingly
				OutputHandler.standard("[System] Writing source file :"+codeFilePath);
				await fs.promises.mkdir( path.dirname(codeFilePath), { recursive: true } );
				await fs.promises.writeFile(codeFilePath, generatedCode.code, "utf8");
				
				if( generatedCode.test ) {
					OutputHandler.standard("[System] Writing test file :"+testFilePath);
					await fs.promises.mkdir( path.dirname(testFilePath), { recursive: true } );
					await fs.promises.writeFile(testFilePath, generatedCode.test, "utf8");
				}

			}
			
			if( config.personality ) {
				let personalityFile = path.resolve(config.spec_dir, "README.md");
				if( (await fileExist( personalityFile )) == false ) {
					personalityFile = scanList[0];
				}
				const remark = await personalityRemark(personalityFile, config.personality, "Completing the build process");

				OutputHandler.standardGreen("[System] Completed build for spec dir")
				OutputHandler.standardGreen(`[AI Remark] ${remark}`)
			} else {
				OutputHandler.standardGreen("[System] Completed build for spec dir")
			}
		} catch(err) {
			OutputHandler.fatalError(err, 51);
		}
	}
}