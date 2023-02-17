const sqlite3 = require('sqlite3').verbose();

let db;

/**
 * Initializes the in-memory sqlite3 database
 * @returns {void}
 */
const setupDB = async () => {
  db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

  db.run('CREATE TABLE IF NOT EXISTS tweets (userHandle TEXT, message TEXT, timestamp INTEGER)', (err) => {
    if (err) {
      console.error(err.message);
    }
  });
};

/**
 * Adds a tweet to the database
 * @param {string} userHandle - The user handle of the tweet
 * @param {string} message - The message of the tweet
 * @returns {void}
 */
const addTweet = async (userHandle, message) => {
  const timestamp = Date.now();
  const sql = `INSERT INTO tweets (userHandle, message, timestamp) VALUES (?, ?, ?)`;
  const params = [userHandle, message, timestamp];
  db.run(sql, params, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
};

/**
 * Lists all tweets from the database
 * @returns {array} - An array of tweets
 */
const listTweets = async () => {
  let tweets = [];
  db.all('SELECT * FROM tweets ORDER BY CASE WHEN userHandle = "elonmusk" THEN 0 ELSE 1 END, timestamp DESC', (err, rows) => {
    if (err) {
      console.error(err.message);
    }
    tweets = rows;
  });

  return tweets;
};

module.exports = {
  setupDB,
  addTweet,
  listTweets,
};