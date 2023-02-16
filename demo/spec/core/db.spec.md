---
type: javascript module
---

Using the sqlite3 npm module

Initialize a sqlite DB, which contains a single table "messages" which will store all the tweets.
This javascript module, will provide the following async functions.

- setupDB : Which takes an optional parameter, for the sqlite file path. If null, initializes the DB as an in-memory database. Also does the required table setup if it does not exists. This DB object is persisted for the other functions.
- addTweet : Which add to the table, a tweet with a user handler, and message.
- listTweet : Which returns a list of tweets, containing the user handle, message, and timestamps. Order the tweets from newest to oldest. Unless the handle is 'elonmusk' which will take priority.