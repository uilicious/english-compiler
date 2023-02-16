---
type: javascript function
namespace: codegen.promptParts
---
Given two string parameters 
- inData : containing the code, which needs to be minified 
- inType : the programming language category either "cstyle" or "xml"

Attempt to safely minify the given data code, while stripping comments in a safe way.

The goal isn't to get the perfect minified code (which we will use another tool), but to safely remove whitespace and comments when possible. And reduce the overall character count.

# Implementation notes

Special consideration needs to be done, to account for handling "comments" within multi-line strings

For example
```
let comment_inStr = "// /* comment */"
let comment_inMultilineStr = '
// /* 
comment 
*/
'
```

This is done using roughly the following strategies, which is implemented as seperate functions (without the type paramter).

simpleAndSafeMinifyXML
- Find and remove <!-- comment --> blocks
- Find and remove whitespaces between blocks (check for ">" and "<")
- Trim the final string

simpleAndSafeMinifyCStyle
- Find 1 string block which can be wrapped with either ` or ' or " quotes. Suggested regex: ('.*'|".*"|`.*`)
	- If no string block is found
		- using regex, remove any trailing // comments for each line
		- Remove / * comment blocks * /
		- Replace multiple whitespace (excluding new lines) with a single space
	- If string block is found
		- Leave the string block untouched
		- Recursively minify the code before and after the string block
- Trim the final string