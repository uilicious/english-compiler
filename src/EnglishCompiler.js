#!/usr/bin/env node

//-------------------------------------
//
//  Dependencies
//
//-------------------------------------

const MainSywac = require("./cli/MainSywac");
const OutputHandler = require("./cli/OutputHandler")

//-------------------------------------
//
// Various argument handling setup
//
//-------------------------------------

//-------------------------------------
//
// Command handling
//
//-------------------------------------

MainSywac.command("spec <subcommand> <args>", {
	desc: "Specification suggestions, and changes command",
	ignore: ['<subcommand>', '<args>'],
	setup: (sywac) => {
		sywac.command( require("./cli/spec/suggest.js") );
	}
});

MainSywac.command("build <subcommand> <args>", {
	desc: "Build the codebase from spec",
	ignore: ['<subcommand>', '<args>'],
	setup: (sywac) => {
		sywac.command( require("./cli/build/all.js") );
		sywac.command( require("./cli/build/file.js") );
	}
});

//----------------------------------------------------
//
// Examples !!!
//
//----------------------------------------------------

// MainSywac.example("$0 --key <access-key> project run 'Project-Awesome' 'suite/test-all'", {
// 	desc: "Runs a test file in the given project name"
// });
// MainSywac.example("$0 --key <access-key> project run 'Project-Awesome' 'suite/test-all' --browser firefox --width 1080 --height 720 ", {
// 	desc: "Runs with a custom browser (firefox), width and height instead" // https://user.uilicious.com/profile/accessKeys
// })
// MainSywac.example("$0 --user <your-awesome-email@not-evil-corp.com> --pass <super-secure-password> run 'Project-Awesome' 'suite/test-all'", {
// 	desc: "Runs a test using your login email and password instead (please use --key instead)"
// });
// MainSywac.example("$0 --key <access-key> project upload 'Project-Delta' ./delta/ui-test/", {
// 	desc: "Upload a folder of files, into the uilicious project, overwrite any existing files"
// });
// MainSywac.example("$0 --key <access-key> project download 'Project-Gamma' ./gamma/ui-test/", {
// 	desc: "Download a ulicious project into a folder, overwrite any existing files"
// });
// MainSywac.example("$0 --apiHost https://<hostname>/<subpath-if-present>/api/v3.0/' <command>", {
// 	desc: "[Enterprise only] Using the CLI with your dedicated instance of uilicious"
// });

//-------------------------------------
//
// Time to let the CLI run!
//
//-------------------------------------

// Enable strict mode
MainSywac.strict(true);

// Parse and exit
MainSywac.parseAndExit().then(argv => {
	// Unparsed segments are placed into: argv._
	// as such we should terminate ! if any unknown command is found
	if( argv._.length > 0 ) {
		OutputHandler.cliArgumentError("Unknown command: "+argv._.join(" "))
	}
});