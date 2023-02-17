// Dependencies setup
//----------------------------

const fs = require("fs")
const path = require("path")
const jsonl = require("node-jsonl")
const lockfile = require('proper-lockfile')

const fileExist = require("../util/fileExist")
const promptToCompletion = require("./promptToCompletion")

// Config loading
//----------------------------
const cacheDir = require("../core/config").prompt_cache_dir;

// Function implementation
//----------------------------

/**
 * Perform a prompt to completion, using the jsonl cache file if provided
 * 
 * The downside of this API, is that it enforces both the stop character, model, and temprature (which is set as 0)
 * 
 * @param {String} prompt 
 * @param {String} jsonlCacheFile 
 */
async function cachedCompletion(prompt, jsonlCacheFile = ".default-promptcache.jsonl", cacheMode = "public") {

    // Cache dir is not set, or cache file is not set, skip it
    if( cacheDir == null || jsonlCacheFile == null || cacheMode == "none" ) {
        return await promptToCompletion(prompt);
    }

    // Compute the full file path, and dir path
    let fullPath = null;
    if( cacheMode == "public" ) {
        fullPath = path.resolve( cacheDir, jsonlCacheFile );
    } else {
        fullPath = path.resolve( cacheDir, ".private", jsonlCacheFile );
    }
    const dirPath = path.dirname( fullPath );
    
    // Ensure dir setup
    await fs.promises.mkdir( dirPath, { recursive: true });

    // Scan the file, if it exists
    // this is done without file locking, as a performance speed up
    // for cache hit, at the cost of higher latency on cache miss
    //
    // additionally because it can cause read/write contention - it can fail.
    // as such any error here is ignored, as it will be retried with a file lock.
    if( await fileExist(fullPath) ) {
        try {
            // Scan the various jsonl lines
            const rl = jsonl.readlines(fullPath);
            while(true) {
                const {value, done} = await rl.next();
                if(done) break;
                // Return the matching completion when found
                if( value.prompt == prompt ) {
                    return value.completion;
                }
            }
        } catch(e) {
            // exception is ignored
        }
    }

    // Get the lock
    let lockRelease = await lockfile.lock(fullPath, { realpath:false });
    
    // Perform actions within a lock
    try {
        // Scan the file, if it exists
        if( await fileExist(fullPath) ) {
            // Scan the various jsonl lines
            const rl = jsonl.readlines(fullPath);
            while(true) {
                const {value, done} = await rl.next();
                if(done) break;
                // Return the matching completion when found
                if( value.prompt == prompt ) {
                    return value.completion;
                }
            }
        }

        // Match not found, perform the prompt
        const completion = await promptToCompletion(prompt);

        // Write it
        await fs.promises.appendFile(fullPath, JSON.stringify({ prompt:prompt, completion:completion })+"\n", { encoding:"utf8" });

        // return the completion response
        return completion
    } finally {
        // Release the lock
        await lockRelease();
    }
}

// Module export
//----------------------------
module.exports = cachedCompletion;

// Special direct execution handling
// https://stackoverflow.com/questions/6398196/detect-if-called-through-require-or-directly-by-command-line
//----------------------------
if( require.main === module ) {
	(async function() {

		// Argument check
		const reqPrompt = process.argv[2];
		if( reqPrompt == null ) {
			console.error( "[ERROR] Missing request prompt as first argument" );
			console.error( `[ERROR] Example: node ./cachedCompletion.js "tell me a joke?"` );
			process.exit(1);
		}

		// Response
		const resp = await cachedCompletion(reqPrompt);
		console.log(resp);
	})();
}