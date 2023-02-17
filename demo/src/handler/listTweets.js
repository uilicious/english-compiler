/**
 * This file implements a single api endpoint for listing tweets.
 *
 * @module listTweet
 * @type {CJS}
 */

const db = require('../core/db');

/**
 * This function is expected to be added as an express.js route.
 * It calls the async function `listTweet`, which is exposed by the db module.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
module.exports = async (req, res) => {
  try {
    // Get the list of tweets from the db module
    const list = await db.listTweet() || [];

    // Return the list as a JSON response
    res.json({ result: list });
  } catch (err) {
    // Log the error and return a 500 status code
    console.error(err);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};