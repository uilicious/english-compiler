# The English Compiler

We know that all great™ projects start with awesome™ detailed functional specifications.
Which is typically written in [English](https://esolangs.org/wiki/English), or its many other spoken language alternatives.

So what if, instead of writing code from functional specs, we simply compile it directly to code?

![CLI help docs for the english](./notes/imgs/EnglishCommand-CLI-help.png)

> Does it work? Yes
> Is it production ready? No
> This is simply a POC - to demostrate what is possible in the future.

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
```.json
{
	// Openai API key
	"openai_apikey": "REPLACE-WITH-YOUR-ACTUAL-KEY-DO-NOT-CHECKIN",

	// Prompt caching dir, this can be used to cache and speed up the build process
    // especially when no specification (or code) changes occured
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