---
type: javascript function
---

This file uses the db module found at `../core/db.js` (which will need to be imported).
And calls the async function `listTweets`, which is exposed by the db module.

This file implements a single api endpoint for listing tweets.

It exports a single function handler, which is expected to be added as an express.js route.

To get the list of tweets, call the db module using `let list = await db.listTweets()`, which will return an array of objects.

The API should return as a JSON, with a "result" parameter containing the array.
Provide the stack trace for any unexpected error that occurs, to the API.