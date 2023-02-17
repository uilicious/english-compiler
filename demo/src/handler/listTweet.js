/**
 * listTweet
 *
 * This function is used to list all tweets from the database.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const listTweet = async (req, res) => {
  try {
    // Get all tweets from the database
    const tweets = await db.listTweet();

    // If no tweets are found, return an empty array
    if (tweets.length === 0) {
      res.json({ result: [] });
    } else {
      // Map the tweets to an array of objects with the required parameters
      const result = tweets.map(tweet => ({
        userHandle: tweet.userHandle,
        message: tweet.message,
        timestamp: tweet.timestamp
      }));

      // Return the result as a JSON
      res.json({ result });
    }
  } catch (err) {
    // Return the stack trace for any unexpected errors
    res.json({ error: err.stack });
  }
};

module.exports = listTweet;