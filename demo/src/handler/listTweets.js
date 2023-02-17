/**
 * listTweets
 *
 * This function is used to list all tweets from the database.
 *
 * @returns {Promise<Object[]>} An array of objects containing the tweets.
 */
const listTweets = async () => {
  try {
    const list = await db.listTweets();
    return list || [];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * listTweetsHandler
 *
 * This function is used to handle the API request for listing tweets.
 *
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
module.exports = async (req, res) => {
  try {
    const list = await listTweets();
    res.json({ result: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};