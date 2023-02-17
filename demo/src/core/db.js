const sqlite3 = require('sqlite3');

/**
 * @module db
 * @description Using the sqlite3 npm module, this module provides functions to initialize a sqlite DB, which contains a single table "messages" which will store all the tweets.
 * The parameters for a tweet is userHandle, message, and timestamp (unixtimestamp in ms).
 */

let db;

/**
 * @function setupDB
 * @description Initializes the DB as an in-memory database with ":memory:" if the path is null. Also does the required table setup if it does not exists. This DB object is persisted for the other functions.
 * @param {string} [dbPath=':memory:'] - The path of the sqlite file.
 */
const setupDB = async (dbPath = ':memory:') => {
  db = new sqlite3.Database(dbPath);
  await db.run(`CREATE TABLE IF NOT EXISTS messages (
    userHandle TEXT,
    message TEXT,
    timestamp INTEGER
  )`);
};

/**
 * @function addTweet
 * @description Adds to the table, a tweet with a userHandle, and message.
 * @param {string} userHandle - The user handle of the tweet.
 * @param {string} message - The message of the tweet.
 */
const addTweet = async (userHandle, message) => {
  await db.run(`INSERT INTO messages (userHandle, message, timestamp) VALUES (?, ?, ?)`, [userHandle, message, Date.now()]);
};

/**
 * @function listTweet
 * @description Returns a list of tweets, containing the userHandle, message, and timestamps. Order the tweets from newest to oldest. Unless the handle is 'elonmusk' which will take priority.
 * @returns {Object[]} An array of objects containing the userHandle, message, and timestamp of the tweets.
 */
const listTweet = async () => {
  const tweets = await db.all(`SELECT userHandle, message, timestamp FROM messages ORDER BY userHandle = 'elonmusk' DESC, timestamp DESC`);
  return tweets.map(tweet => ({
    userHandle: tweet.userHandle,
    message: tweet.message,
    timestamp: new Date(tweet.timestamp).toISOString()
  }));
};

module.exports = {
  setupDB,
  addTweet,
  listTweet
};