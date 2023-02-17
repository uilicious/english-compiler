const sqlite3 = require('sqlite3');

/**
 * @module db
 * @description Using an inmemory sqlite3 module, as a database store twitter messages
 * Where each tweet consist of the following parameters
 * - userHandle
 * - message
 * - timestamp (unixtimestamp in ms)
 */

let db;

/**
 * @function setupDB
 * @description Does any setup if required. Including table or datastructures.
 * The database should be seeded with 5 example tweets on setup.
 */
const setupDB = async () => {
  db = new sqlite3.Database(':memory:');
  await db.run('CREATE TABLE tweets (userHandle TEXT, message TEXT, timestamp INTEGER)');
  await db.run('INSERT INTO tweets VALUES ("elonmusk", "Test tweet 1", 1599454545000)');
  await db.run('INSERT INTO tweets VALUES ("elonmusk", "Test tweet 2", 1599454546000)');
  await db.run('INSERT INTO tweets VALUES ("elonmusk", "Test tweet 3", 1599454547000)');
  await db.run('INSERT INTO tweets VALUES ("elonmusk", "Test tweet 4", 1599454548000)');
  await db.run('INSERT INTO tweets VALUES ("elonmusk", "Test tweet 5", 1599454549000)');
};

/**
 * @function addTweet
 * @description Save a tweet with a userHandle, and message.
 * @param {string} userHandle - The user handle of the tweet
 * @param {string} message - The message of the tweet
 */
const addTweet = async (userHandle, message) => {
  await db.run('INSERT INTO tweets VALUES (?, ?, ?)', [userHandle, message, Date.now()]);
};

/**
 * @function listTweets
 * @description Returns a list of tweets, containing the userHandle, message, and timestamps. Order the tweets from newest to oldest.
 * Tweets from the userHandle "elonmusk", should be priotized above all tweets (as per the Feb-2023 changes).
 * @returns {array} An array of tweets
 */
const listTweets = async () => {
  const tweets = await db.all('SELECT * FROM tweets ORDER BY timestamp DESC');
  const elonTweets = tweets.filter(tweet => tweet.userHandle === 'elonmusk');
  const otherTweets = tweets.filter(tweet => tweet.userHandle !== 'elonmusk');
  return [...elonTweets, ...otherTweets].map(tweet => ({
    userHandle: tweet.userHandle,
    message: tweet.message,
    timestamp: tweet.timestamp
  }));
};

module.exports = {
  setupDB,
  addTweet,
  listTweets
};