//--------------------------------------------------
// Dependencies
//--------------------------------------------------

const parseMD = require('parse-md').default
const fs = require("fs");
const path = require('path');

//--------------------------------------------------
// Implementation
//--------------------------------------------------

/**
 * Get the markdown string, with seperated metadata / frontmatter str
 * 
 * @param {String} filePath for the full markdown file
 * 
 * @return Generated code string, wrapped in a promise
 */
 async function getMarkdownObj( filePath ) {
	// Read the file, and split out the metadata + content
	let fullFileData = await fs.promises.readFile( filePath, "utf8" );
	let { metadata, content } = parseMD(fullFileData);
    let frontmatter = "";

    // Extract frontmatter string
    if( fullFileData.startsWith("---") ) {
        frontmatter = "---"+fullFileData.split("---")[1]+"---";
    }

    // Return all 3 items
    return {
        metadata,
        frontmatter,
        content
    }
}
module.exports = getMarkdownObj;
