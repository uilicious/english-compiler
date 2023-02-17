/**
 * addTweet
 *
 * This function handles the API request for adding a tweet.
 *
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
const db = require('../core/db');

module.exports = async (req, res) => {
  // Validate the request body
  if (!req.body || !req.body.userHandle || !req.body.message) {
    return res.status(400).send({
      result: 'error',
      message: 'userHandle and message are required'
    });
  }

  // Call the db.addTweet function
  try {
    await db.addTweet(req.body.userHandle, req.body.message);
    return res.send({ result: 'ok' });
  } catch (err) {
    // Return the stack trace for any unexpected errors
    return res.status(500).send({
      result: 'error',
      message: err.message,
      stack: err.stack
    });
  }
};