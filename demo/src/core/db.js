const sqlite3 = require('sqlite3');

/**
 * @module db
 * @description Using the sqlite3 npm module, this module provides functions to initialize a sqlite DB, which contains a single table "messages" which will store all the tweets.
 */

let db;

/**
 * @function setupDB
 * @description Initializes the DB as an in-memory database, or with the given file path. Also does the required table setup if it does not exists. This DB object is persisted for the other functions.
 * @param {string} [filePath=null] - The file path for the sqlite DB. If null, initializes the DB as an in-memory database.
 */
const setupDB = async (filePath = null) => {
  db = new sqlite3.Database(filePath);
  const sql = `
    CREATE TABLE IF NOT EXISTS messages (
      userHandle TEXT,
      message TEXT,
      timestamp INTEGER
    );
  `;
  await db.run(sql);
};

/**
 * @function addTweet
 * @description Adds a tweet with a user handle, and message to the table.
 * @param {string} userHandle - The user handle of the tweet.
 * @param {string} message - The message of the tweet.
 */
const addTweet = async (userHandle, message) => {
  const sql = `
    INSERT INTO messages (userHandle, message, timestamp)
    VALUES (?, ?, ?)
  `;
  const timestamp = Date.now();
  await db.run(sql, [userHandle, message, timestamp]);
};

/**
 * @function listTweets
 * @description Returns a list of tweets, containing the user handle, message, and timestamps. Order the tweets from newest to oldest. Unless the handle is 'elonmusk' which will take priority.
 * @returns {Object[]} An array of objects containing the user handle, message, and timestamp of the tweets.
 */
const listTweets = async () => {
  const sql = `
    SELECT userHandle, message, timestamp
    FROM messages
    ORDER BY userHandle = 'elonmusk' DESC, timestamp DESC
  `;
  const tweets = await db.all(sql);
  return tweets.map(tweet => ({
    userHandle: tweet.userHandle,
    message: tweet.message,
    timestamp: new Date(tweet.timestamp).toISOString()
  }));
};

module.exports = {
  setupDB,
  addTweet,
  listTweets
};