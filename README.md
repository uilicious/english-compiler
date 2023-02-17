# The English Compiler

We know that all great™ projects start with awesome™ detailed functional specifications.
Which is typically written in [English](https://esolangs.org/wiki/English), or its many other spoken language alternatives.

So what if, instead of writing code from functional specs, we simply compile it directly to code?

![CLI help docs for the english](./notes/imgs/EnglishCommand-CLI-help.png)

> Does it work? Yes
> Is it production ready? No
> 
> This is simply a POC. However if you like to take it further, you may give it a try.

For more details, see the 3 minute youtube presentation

[![The English Compiler : in 3 minutes](./notes/imgs/yotube-thumbnail.png)](https://www.youtube.com/watch?v=hdPG-avfpZo)

# How is this "better" then ChatGPT ?

Existing Open AI models, have an upper cap to the size of their input and output.
This limits their usage to small code snippets as of now.

By using ridiculous amount of impractical prompt chaining and engineering, we work around these limitations, to be able to generate both entire applications.
Or really large (java) files.

[Screenshot of a large wall of text and code, to represent how large the oauth2 spec is](./notes/imgs/oauth2-spec-and-code.png)
> An example of how large the OAuth2 integration specification and code with comment results into

Helping validate the possible future, of AI being a potential new abstraction compiler layer, to existing modern programming language.
Just as how moden programming languages are an abstract layer to operating system apis, which is in turn is an abstraction to machine code.

# How do I install it?

The easiest way is to simply install it from NPM

```.bash
npm install -g english-compiler
```

# How do I configure it?

From the project you wish to build from, you should at minimum have a folder for the specs file, and the source code.
You can then setup an `english-compiler.jsonc` file, which should contain all the required settings. Including the openai API key.

For obvious reasons, please do not checkin your openai API key to a public repo

The following is an example of the settings
```.jsonc
{
	// Openai API key
	"openai_apikey": "REPLACE-WITH-YOUR-ACTUAL-KEY-AND-DO-NOT-CHECKIN",

	// Prompt caching dir, this can be used to cache and speed up the build process
	// especially when no specification (or code) changes occured
	//
	// This cache is also critical, in event that you hit the openAI rate limit 
	// (or when their server becomes too busy with chatGPT). As it will abort the build.
	//
	// Caching the prompts, allow you to continue the build, without starting from scratch.
	"prompt_cache_dir": "./prompt_cache",

	// Specification directory, to scan for `*.spec.md` files
	"spec_dir": "./spec",

	// Source code output directory
	"code_dir": "./src",

	// Test code output directory (only supported for JS now)
	"test_dir": "./test",

	// Add some personality based remarks, set to false/null if you want to skip this
	// and save on token consumption (this feature is just for fun)
	"personality": "Sassy & Sarcastic"
}
```

# Run one of our demo !

> Note that the demo, include a precomputed cache of the AI compilation process, so unless you change part of the spec file. You do not need to update the openai key in the settings.
>
> Also yes, the output has some minor bugs here and there. This is a Proof-of-concept.
> I have spent over 4 hours, trying to slowly change the specs, to fix all the bugs. But the write-compile-test loop is just too damn slow.

## Demo 1 : Building a simple "twitter clone" demo

This is a simple complete application for a twitter clone, without login or authentication.
Including both the UI, and the API endpoints.

Go into the `demo/twitter-clone` folder

**Ask the AI for suggestions on a spec file**

`EnglishCompiler spec suggest spec/ui/index.spec.md`

![CLI example output of the spec suggest command](./notes/imgs/CLI-spec-suggest.png)

**Build a single spec file**

`EnglishCompiler build file spec/core/db.spec.md`

![CLI example of building one spec file](./notes/imgs/CLI-build-one.png)

**Build all spec file**

`EnglishCompiler build all`

![CLI example of building all spec file](./notes/imgs/CLI-build-all.png)

If you want to really check, that it buidls the file feel free to delete the src directory, and run the build process.

## Demo 2 : Larger java class

This is an example for a java class, which would have been too large, and goes beyond 4000+ tokens once you include the spec and code comments.
It is not possible to generate this directly via openAI api, without the tricks we have resorted to in this project.

There is only 1 file for this demostartion

Go into the `demo/java-class` folder

**Build all spec file**

`EnglishCompiler build all`

## The specification file format

