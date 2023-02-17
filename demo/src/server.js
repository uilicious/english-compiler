const express = require('express');
const addTweetHandler = require('./handler/addTweet');
const listTweetsHandler = require('./handler/listTweets');
const db = require('./core/db');

const app = express();

/**
 * Setup express to parse JSON request data
 */
app.use(express.json());

/**
 * Setup routes for addTweet and listTweets
 */
app.post('/api/addTweet', addTweetHandler);
app.get('/api/listTweets', listTweetsHandler);

/**
 * Serve static files from the 'ui' directory
 */
app.use(express.static(`${__dirname}/ui`));

/**
 * Initialize the database and start the server
 */
db.setupDB()
  .then(() => {
    app.listen(8800);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });