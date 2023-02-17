const sqlite3 = require('sqlite3').verbose();

let db;

/**
 * Setup the in-memory sqlite3 database
 *
 * @returns {Promise<void>}
 */
const setupDB = async () => {
  db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

  db.run(`CREATE TABLE IF NOT EXISTS tweets (
    userHandle TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  )`);

  // Seed the database with 5 example tweets
  const seedData = [
    ['user1', 'message1', 1599454545000],
    ['user2', 'message2', 1599454546000],
    ['user3', 'message3', 1599454547000],
    ['user4', 'message4', 1599454548000],
    ['user5', 'message5', 1599454549000]
  ];
  const placeholders = seedData.map(() => '(?, ?, ?)').join(',');
  const values = seedData.reduce((acc, curr) => acc.concat(curr), []);
  db.run(`INSERT INTO tweets (userHandle, message, timestamp) VALUES ${placeholders}`, values);
};

/**
 * Add a tweet to the database
 *
 * @param {string} userHandle - The user handle of the tweet
 * @param {string} message - The message of the tweet
 * @returns {Promise<void>}
 */
const addTweet = async (userHandle, message) => {
  const timestamp = Date.now();
  db.run(`INSERT INTO tweets (userHandle, message, timestamp) VALUES (?, ?, ?)`, [userHandle, message, timestamp]);
};

/**
 * List all tweets from the database
 *
 * @returns {Promise<Array>} - An array of tweets
 */
const listTweets = async () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT userHandle, message, timestamp FROM tweets ORDER BY timestamp DESC`, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
};

module.exports = {
  setupDB,
  addTweet,
  listTweets
};