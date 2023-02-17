---
type: javascript function
---

This file implements a single api endpoint for "addTweet"

It exports a single function handler, which is expected to be added as an express.js route.

This file uses the db module found at `../core/db.js` (which will need to be imported).
And calls the async function `addTweet`, which is exposed by the db module.

The addTweet function, requires two parameters, the "userHandle", and the "message", which should be provided to the API.

The API should throw an error if these parameters are not provided.
The API should return with an object with "result" being "ok", if succesful.

Provide the stack trace for any unexpected error that occurs, to the API.