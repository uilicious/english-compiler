const express = require('express');
const db = require('./core/db');
const addTweetHandler = require('./handler/addTweet');
const listTweetsHandler = require('./handler/listTweets');

const app = express();

/**
 * Initializes the express server and sets up the routes
 * @returns {Promise} - resolves when the server is ready
 */
const initServer = async () => {
  await db.setupDB();

  app.post('/api/addTweet', addTweetHandler);
  app.get('/api/listTweet', listTweetsHandler);
  app.use(express.static(`${__dirname}/ui`));

  return new Promise((resolve, reject) => {
    const server = app.listen(8800, err => {
      if (err) {
        reject(err);
      } else {
        console.log('Server listening on port 8800');
        resolve(server);
      }
    });
  });
};

module.exports = initServer;