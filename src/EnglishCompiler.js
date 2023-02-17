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

MainSywac.example("$0 spec suggest spec/OAuth2ProviderHelper", {
	desc: "Ask the AI, for improvement suggestions or instruct it on how to make changes"
});
MainSywac.example("$0 build file spec/core/db.spec.md ", {
	desc: "Builds a single specification file into code \n  (takes >10 minutes, for large complex files) "
})
MainSywac.example("$0 build all", {
	desc: "Scans the currently configured spec folder, for all the spec files, and build it! \n(for large projects, this can take hours) "
});


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