---
type: html file
---
HTML website. Which is a twitter clone.

Include inline CSS styling. 
With nice twitter blue background, and a well presented input form.
Each tweet message should be styled with round borer, margins, and white background.

It calls the server `/api/listTweets` to get the list of tweets from the "result" parameter.
Each tweet contains the following 
- userHandle
- message
- timestamp (unixtimestamp in ms)

For posting of new tweets, users can fill in both their userHandle and message.
This will submit the tweet via the server api `/api/addTweet` which expects both parameters.

The page should be reloaded, after sending the tweet.
No login or signup is required for this website.
