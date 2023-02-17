/**
 * This file implements a single api endpoint for "addTweet"
 *
 * @module addTweet
 * @type {CJS}
 */

const db = require('../core/db');

/**
 * This function is expected to be added as an express.js route.
 * It calls the async function `addTweet`, which is exposed by the db module.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - An object with "result" being "ok", if succesful
 */
module.exports = async (req, res) => {
  const { userHandle, message } = req.body;

  // Validate the userHandle and message parameters
  if (!userHandle || !message) {
    return res.status(400).json({
      error: 'userHandle and message are required'
    });
  }

  try {
    // Call the db module's addTweet function
    await db.addTweet(userHandle, message);
    return res.status(200).json({ result: 'ok' });
  } catch (err) {
    // Return the stack trace for any unexpected error that occurs
    return res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
};