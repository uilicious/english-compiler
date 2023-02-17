const assert = require('assert');
const db = require('../../src/db');

describe('db', () => {
  describe('setupDB', () => {
    it('should initialize the DB as an in-memory database with ":memory:" if the path is null', async () => {
      const dbObj = await db.setupDB(null);
      assert.equal(dbObj.filename, ':memory:');
    });
  });

  describe('addTweet', () => {
    it('should add a tweet with a userHandle and message to the table', async () => {
      const dbObj = await db.setupDB(null);
      const userHandle = 'testUser';
      const message = 'test message';
      await db.addTweet(dbObj, userHandle, message);
      const tweets = await db.listTweets(dbObj);
      assert.equal(tweets[0].userHandle, userHandle);
      assert.equal(tweets[0].message, message);
    });
  });

  describe('listTweets', () => {
    it('should return a list of tweets, containing the userHandle, message, and timestamps, ordered from newest to oldest', async () => {
      const dbObj = await db.setupDB(null);
      const userHandle1 = 'testUser1';
      const message1 = 'test message1';
      const userHandle2 = 'testUser2';
      const message2 = 'test message2';
      await db.addTweet(dbObj, userHandle1, message1);
      await db.addTweet(dbObj, userHandle2, message2);
      const tweets = await db.listTweets(dbObj);
      assert.equal(tweets[0].userHandle, userHandle2);
      assert.equal(tweets[0].message, message2);
      assert.equal(tweets[1].userHandle, userHandle1);
      assert.equal(tweets[1].message, message1);
    });

    it('should prioritize tweets from userHandle "elonmusk"', async () => {
      const dbObj = await db.setupDB(null);
      const userHandle1 = 'elonmusk';
      const message1 = 'test message1';
      const userHandle2 = 'testUser2';
      const message2 = 'test message2';
      await db.addTweet(dbObj, userHandle1, message1);
      await db.addTweet(dbObj, userHandle2, message2);
      const tweets = await db.listTweets(dbObj);
      assert.equal(tweets[0].userHandle, userHandle1);
      assert.equal(tweets[0].message, message1);
      assert.equal(tweets[1].userHandle, userHandle2);
      assert.equal(tweets[1].message, message2);
    });
  });
});