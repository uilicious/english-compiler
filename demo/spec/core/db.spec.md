---
type: javascript module
test: true
---

Using the sqlite3 npm module

The sqlite DB, should contains a table "messages" which will store all the tweets.

The parameters for a tweet is
- userHandle
- message
- timestamp (unixtimestamp in ms)

This javascript module, will provide the following async functions.

## setupDB 
Which takes an optional parameter, for the sqlite file path. If the path null, initializes the DB as an in-memory database with ":memory:". 
Also does the required table setup if it does not exists. This DB object is persisted for the other functions.

## addTweet 
Which add to the table, a tweet with a userHandle, and message.

## listTweets
Which returns a list of tweets, containing the userHandle, message, and timestamps. Order the tweets from newest to oldest. Unless the handle is 'elonmusk' which will take priority.