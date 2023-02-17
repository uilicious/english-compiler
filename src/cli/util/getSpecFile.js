const fileExist = require("../../util/fileExist")
const config = require("../../core/config")
const path = require("path")
/**
 * Check and get the relative path (to the spec dir) of the spec file
 * and handle 2 major permutation of the paths
 * 
 * - with or without .spec.md suffix
 * - with or without spec dir path
 */
async function getSpecFile(filepath) {
    let fullpath = path.resolve(filepath);
    if( await fileExist( fullpath ) ) {
        return fullpath;
    }

    fullpath = path.resolve(config.spec_dir, filepath);
    if( await fileExist( fullpath ) ) {
        return fullpath;
    }

    fullpath = path.resolve(filepath+".spec.md");
    if( await fileExist( fullpath ) ) {
        return fullpath;
    }

    fullpath = path.resolve(config.spec_dir, filepath+".spec.md");
    if( await fileExist( fullpath ) ) {
        return fullpath;
    }

    // No valid path, return null
    return null;
}

module.exports = getSpecFile