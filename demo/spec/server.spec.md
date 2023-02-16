---
type: javascript module
---

A simple express JS server, which does the following

- route `/api/addTweet` to a handler, which is a module at `./handler/addTweet`
- route `/api/listTweet` to a handler, which is a module at `./handler/listTweet`
- serve static file assets, found at "./ui", relative to the current source code file

And is initialized and run on port 8800