---
type: javascript file
---

A simple express JS server, which does the following

- (POST) route `/api/addTweet` to a handler, which is a module at `./handler/addTweet`
    - We will need to setup the `express.json()` to process the JSON request data
- (GET) route `/api/listTweets` to a handler, which is a module at `./handler/listTweets`
- serve static file assets, found at "./ui", relative to the current file using `__dirname`

This module, will need to initialize the DB, by importing the `./core/db` module, and calling its `setupDB()` function.

The express server is initialized and run on port 8800
This file, is expected to run on its own. And does not need to be exposed as a module.