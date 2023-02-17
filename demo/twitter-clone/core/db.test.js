// db.test.js

const assert = require('assert');
const db = require('../../src/db');

describe('db', () => {
  beforeEach(async () => {
    await db.setupDB();
  });

  describe('addTweet', () => {
    it('should add a tweet with a userHandle and message', async () => {
      const userHandle = 'testUser';
      const message = 'This is a test message';
      const tweet = await db.addTweet(userHandle, message);
      assert.equal(tweet.userHandle, userHandle);
      assert.equal(tweet.message, message);
    });
  });

  describe('listTweets', () => {
    it('should return a list of tweets, ordered from newest to oldest', async () => {
      const tweets = await db.listTweets();
      assert.equal(tweets.length, 5);
      assert.equal(tweets[0].userHandle, 'testUser');
      assert.equal(tweets[0].message, 'This is a test message');
      assert.equal(tweets[1].userHandle, 'testUser2');
      assert.equal(tweets[1].message, 'This is another test message');
    });
  });
});