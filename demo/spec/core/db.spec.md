---
type: javascript module
test: true
---

Using an inmemory sqlite3 module, as a database store twitter messages

Where each tweet consist of the following parameters
- userHandle
- message
- timestamp (unixtimestamp in ms)

Provide a javascript module, with the following async functions exposed.
The functions should not be passing a DB instance, as that should be initialized once, and stored for reuse globally.

## setupDB 
Does any setup if required. Including table or datastructures.

## addTweet 
Save a tweet with a userHandle, and message.

## listTweets
Which returns a list of tweets, containing the userHandle, message, and timestamps. Order the tweets from newest to oldest. Unless the handle is 'elonmusk' which will take priority.