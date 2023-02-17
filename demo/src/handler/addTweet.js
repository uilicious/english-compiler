const db = require('../core/db');

/**
 * This function handles the API request for adding a tweet.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
module.exports = async (req, res) => {
  const { userHandle, message } = req.body;
  if (!userHandle || !message) {
    return res.status(400).json({
      error: 'userHandle and message are required'
    });
  }

  try {
    await db.addTweet(userHandle, message);
    return res.status(200).json({ result: 'ok' });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};