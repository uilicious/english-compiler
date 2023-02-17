// Initialize the tokenizer
const GPT3Tokenizer = require('gpt3-tokenizer').default;
const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });

/**
 * Given the input data, encode and get the token count
 * @param {String} data
 * 
 * @return token length as int
 */
module.exports = function getTokenCount( data ) {
    let tokenObj = tokenizer.encode( data );
    return tokenObj.bpe.length;
}