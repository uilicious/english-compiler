const express = require('express');
const addTweetHandler = require('./handler/addTweet');
const listTweetHandler = require('./handler/listTweet');

// Create an express app
const app = express();

// Route the '/api/addTweet' endpoint to the addTweetHandler
app.use('/api/addTweet', addTweetHandler);

// Route the '/api/listTweet' endpoint to the listTweetHandler
app.use('/api/listTweet', listTweetHandler);

// Serve static files from the './ui' directory
app.use(express.static('./ui'));

// Start the server on port 8800
const port = 8800;
app.listen(port, () => console.log(`Server listening on port ${port}`));