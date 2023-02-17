const express = require('express');
const addTweetHandler = require('./handler/addTweet');
const listTweetHandler = require('./handler/listTweet');
const db = require('./core/db');

const app = express();

// Setup the database and start the server
db.setupDB()
  .then(() => {
    // Setup the routes
    app.post('/api/addTweet', addTweetHandler);
    app.get('/api/listTweet', listTweetHandler);

    // Serve static files from the 'ui' directory
    app.use(express.static(`${__dirname}/ui`));

    // Start the server on port 8800
    app.listen(8800, () => {
      console.log('Server listening on port 8800');
    });
  })
  .catch(err => {
    console.error('Error setting up DB:', err);
  });

/**
 * @module server
 * @description A simple express JS server, which does the following
 * 
 * - (POST) route `/api/addTweet` to a handler, which is a module at `./handler/addTweet`
 * - (GET) route `/api/listTweet` to a handler, which is a module at `./handler/listTweet`
 * - serve static file assets, found at "./ui", relative to the current file using `__dirname`
 * 
 * This module, will need to initialize the DB, by importing the `./core/db` module, and calling its `setupDB()` function.
 * The express server is initialized and run on port 8800
 */