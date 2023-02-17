const assert = require('assert');
const db = require('../../src/db');

describe('db', () => {
  describe('setupDB', () => {
    it('should initialize the DB with the given path', async () => {
      const dbPath = './test.db';
      const dbObj = await db.setupDB(dbPath);
      assert.equal(dbObj.filename, dbPath);
    });

    it('should initialize the DB as an in-memory database with ":memory:" if no path is given', async () => {
      const dbObj = await db.setupDB();
      assert.equal(dbObj.filename, ':memory:');
    });
  });

  describe('addTweet', () => {
    it('should add a tweet with a userHandle and message', async () => {
      const dbObj = await db.setupDB();
      const userHandle = 'testUser';
      const message = 'This is a test message';
      await db.addTweet(dbObj, userHandle, message);
      const tweets = await db.listTweets(dbObj);
      assert.equal(tweets[0].userHandle, userHandle);
      assert.equal(tweets[0].message, message);
    });
  });

  describe('listTweets', () => {
    it('should return a list of tweets, containing the userHandle, message, and timestamps', async () => {
      const dbObj = await db.setupDB();
      const userHandle = 'testUser';
      const message = 'This is a test message';
      await db.addTweet(dbObj, userHandle, message);
      const tweets = await db.listTweets(dbObj);
      assert.equal(tweets[0].userHandle, userHandle);
      assert.equal(tweets[0].message, message);
      assert.ok(tweets[0].timestamp);
    });

    it('should order the tweets from newest to oldest', async () => {
      const dbObj = await db.setupDB();
      const userHandle = 'testUser';
      const message1 = 'This is a test message 1';
      const message2 = 'This is a test message 2';
      await db.addTweet(dbObj, userHandle, message1);
      await db.addTweet(dbObj, userHandle, message2);
      const tweets = await db.listTweets(dbObj);
      assert.equal(tweets[0].message, message2);
      assert.equal(tweets[1].message, message1);
    });

    it('should take priority for tweets from userHandle "elonmusk"', async () => {
      const dbObj = await db.setupDB();
      const userHandle1 = 'testUser';
      const userHandle2 = 'elonmusk';
      const message1 = 'This is a test message 1';
      const message2 = 'This is a test message 2';
      await db.addTweet(dbObj, userHandle1, message1);
      await db.addTweet(dbObj, userHandle2, message2);
      const tweets = await db.listTweets(dbObj);
      assert.equal(tweets[0].userHandle, userHandle2);
      assert.equal(tweets[1].userHandle, userHandle1);
    });
  });
});