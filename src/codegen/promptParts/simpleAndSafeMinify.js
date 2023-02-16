/**
 * Given two string parameters 
 * - inData : containing the code, which needs to be minified 
 * - inType : the programming language category either "cstyle" or "xml"
 * 
 * Attempt to safely minify the given data code, while stripping comments in a safe way.
 * The goal isn't to get the perfect minified code (which we will use another tool), but to safely remove whitespace and comments when possible. And reduce the overall character count.
 * 
 * @param {string} inData - The code to minify
 * @param {string} inType - The programming language category either "cstyle" or "xml"
 * 
 * @returns {string} The minified code
 */
const simpleAndSafeMinify = (inData, inType) => {
  let outData = '';
  if (inType === 'xml') {
    outData = simpleAndSafeMinifyXML(inData);
  } else if (inType === 'cstyle') {
    outData = simpleAndSafeMinifyCStyle(inData);
  }
  return outData.trim();
};

/**
 * Find and remove <!-- comment --> blocks
 * Find and remove whitespaces between blocks (check for ">" and "<")
 * Trim the final string
 * 
 * @param {string} inData - The code to minify
 * 
 * @returns {string} The minified code
 */
const simpleAndSafeMinifyXML = (inData) => {
  // Find and remove <!-- comment --> blocks
  const commentRegex = /<!--[\s\S]*?-->/g;
  let outData = inData.replace(commentRegex, '');

  // Find and remove whitespaces between blocks (check for ">" and "<")
  const whitespaceRegex = />\s+</g;
  outData = outData.replace(whitespaceRegex, '><');

  // Trim the final string
  return outData.trim();
};

/**
 * Find 1 string block which can be wrapped with either ` or ' or " quotes.
 * If no string block is found, using regex, remove any trailing // comments for each line
 * Remove / * comment blocks * /
 * Replace multiple whitespace (excluding new lines) with a single space
 * If string block is found, leave the string block untouched
 * Recursively minify the code before and after the string block
 * Trim the final string
 * 
 * @param {string} inData - The code to minify
 * 
 * @returns {string} The minified code
 */
const simpleAndSafeMinifyCStyle = (inData) => {
  // Find 1 string block which can be wrapped with either ` or ' or " quotes.
  const strRegex = /('.*'|".*"|`.*`)/;
  const strMatch = inData.match(strRegex);

  // If no string block is found
  if (!strMatch) {
    // using regex, remove any trailing // comments for each line
    const commentRegex = /\/\/.*/g;
    let outData = inData.replace(commentRegex, '');

    // Remove / * comment blocks * /
    const blockCommentRegex = /\/\*[\s\S]*?\*\//g;
    outData = outData.replace(blockCommentRegex, '');

    // Replace multiple whitespace (excluding new lines) with a single space
    const whitespaceRegex = /\s+/g;
    outData = outData.replace(whitespaceRegex, ' ');

    // Trim the final string
    return outData.trim();
  }

  // If string block is found
  // Leave the string block untouched
  const strStart = strMatch.index;
  const strEnd = strStart + strMatch[0].length;
  const beforeStr = inData.slice(0, strStart);
  const afterStr = inData.slice(strEnd);

  // Recursively minify the code before and after the string block
  return simpleAndSafeMinifyCStyle(beforeStr) + strMatch[0] + simpleAndSafeMinifyCStyle(afterStr);
};

module.exports = simpleAndSafeMinify;