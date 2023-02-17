const fs = require("fs");

/**
 * Asynchronously checks if a file exists. 
 * 
 * Eugene notes: Honestly this should be just a native nodejs command
 *
 * @param {string} filepath - The path to the file to check.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the file exists or not.
 */
async function fileExist(filepath) {
    return new Promise((good,bad) => {
        try {
            fs.stat(filepath, (err, stats) => {
                if(err) {
                    good(false);
                } else {
                    if( stats.isFile() ) {
                        good(true);
                    } else {
                        good(false);
                    }
                }
            });
        } catch(e) {
            bad(e);
        }
    });
}

module.exports = fileExist;