// Load the required libraries
const fs = require('fs');
const path = require('path');

/**
 * Recursively scan for *.prompt.md files
 * And return all the found paths
 * 
 * @param {String} sourcePath to scan from
 * @param {Array<Regex>} fileNameRegexArr to use for matching, use empty array or null to match all filenames
 * @param {Array<String>} scanDir to scan/filter against, default null scans everything
 * @param {Array<String>} excludeDir to scan/filter against, default null scans everything
 * @param {Boolean} relativePath from the sourcePath is return instead
 * 
 * @return {Array<String>} list of various files, in full absolute path form
 **/
async function scanDirForFiles( sourcePath, fileNameRegexArr, scanDir = null, excludeDir = [".git"], relativePath = true ) {

	// resolve sourcpath first
	sourcePath = path.resolve(sourcePath);

	// Check that current sourcePath is a directory, if not abort
	if( !(await fs.promises.stat(sourcePath)).isDirectory() ) {
		return [];
	}

	// Prepare the response array
	let retArray = [];

	// Scan dir is provided, use that instead
	if( scanDir != null ) {
		for(let i=0; i<scanDir.length; ++i) {
			// Scan each scanDir
			const recursionRes = await scanDirForFiles( path.resolve(sourcePath, scanDir[i]), fileNameRegexArr, null, null, false );
			// And merge it together
			retArray.push(recursionRes);
		}
	} else {
		// Read all files in the current directory
		const filenames = await fs.promises.readdir( sourcePath );

		// Loop through each file
		for (const filename of filenames) {
			// Exclude dir
			if( excludeDir != null && excludeDir.indexOf(filename) >= 0 ) {
				continue;
			}
		
			// Join as a path
			let filePath = path.resolve( sourcePath, filename );
	
			// Check if its a folder
			const stat = await fs.promises.stat(filePath);
			if (stat.isDirectory()) {
				// Recurssion
				const recursionRes = await scanDirForFiles( filePath, fileNameRegexArr, null, null, false );
	
				// Merge it together
				retArray.push(recursionRes);
			} else {
				// Is matching
				let matching = false;
				if(fileNameRegexArr == null || fileNameRegexArr.length == 0) {
					matching = true;
				}
				// Check if its a matching file
				for( const fileRegex of fileNameRegexArr ) {
					if( fileRegex.test(filename) ) {
						// Add path the ret array
						matching = true;
						break;
					}
				}

				// Add if its matching
				if(matching) {
					retArray.push( filePath );
				}
				// Else does nothing, file didn't match
			}
		} 
	}
	
	// Flatten the array
	retArray = retArray.flat();

	// Return the full retArray
	// as no path processing is required
	if( relativePath == false ) {
		return retArray;
	}   
	
	// Return the relative path instead
	return retArray.map((filePath) => {
		return path.relative( sourcePath, filePath );
	});
}
module.exports = scanDirForFiles;
