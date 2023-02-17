---
type: javascript function
---

This file implements a single api endpoint for "listTweet"

It exports a single function handler, which is expected to be added as an express.js route.

The db module imported via `const db = require('../core/db')`
The db modules provies the async function `listTweet`, along with various other functions.

THe listTweet function, requires no parameters, and returns an array containing tweet objects with the following parameter
- userHandle
- message
- timestamp

The API should return as a JSON, with a "result" parameter containing the array.

Provide the stack trace for any unexpected error that occurs, to the API.