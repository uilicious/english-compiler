// simpleAndSafeMinify.test.js

const assert = require('assert');
const simpleAndSafeMinify = require('./simpleAndSafeMinify');

describe('simpleAndSafeMinify', () => {
  it('should minify cstyle code', () => {
    const inData = `
      let comment_inStr = "// /* comment */"
      let comment_inMultilineStr = '
      // /* 
      comment 
      */
      '
    `;
    const inType = 'cstyle';
    const expected = `let comment_inStr="// /* comment */"let comment_inMultilineStr='
      // /* 
      comment 
      */
      '`;
    const actual = simpleAndSafeMinify(inData, inType);
    assert.equal(actual, expected);
  });

  it('should minify xml code', () => {
    const inData = `
      <div>
        <!-- comment -->
        <span>
          Text
        </span>
      </div>
    `;
    const inType = 'xml';
    const expected = `<div><span>Text</span></div>`;
    const actual = simpleAndSafeMinify(inData, inType);
    assert.equal(actual, expected);
  });
});