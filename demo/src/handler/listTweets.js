/**
 * This file implements a single api endpoint for listing tweets.
 * It exports a single function handler, which is expected to be added as an express.js route.
 *
 * @module listTweets
 */

const db = require('../core/db');

/**
 * This function is used to list tweets.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - A JSON object containing the list of tweets
 */
module.exports = async (req, res) => {
  try {
    // Get the list of tweets from the db module
    const list = await db.listTweets() || [];

    // Return the list of tweets as a JSON object
    res.json({ result: list });
  } catch (err) {
    // Return the stack trace for any unexpected error that occurs
    res.status(500).json({ error: err.stack });
  }
};