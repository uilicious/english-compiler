---
type: javascript module
---

A simple express JS server, which does the following

- (POST) route `/api/addTweet` to a handler, which is a module at `./handler/addTweet`
- (GET) route `/api/listTweet` to a handler, which is a module at `./handler/listTweet`
- serve static file assets, found at "./ui", relative to the current file using `__dirname`

This module, will need to initialize the DB, by importing the `./core/db` module, and calling its `setupDB()` function.

The express server is initialized and run on port 8800