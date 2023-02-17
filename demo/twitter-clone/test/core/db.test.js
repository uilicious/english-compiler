const assert = require('assert');

describe('db', () => {
  let db;

  beforeEach(() => {
    db = require('../../src/db');
  });

  describe('setupDB', () => {
    it('should setup the database', async () => {
      await db.setupDB();
      // assert that the database is setup
    });

    it('should seed the database with 5 example tweets', async () => {
      await db.setupDB();
      // assert that the database is seeded with 5 example tweets
    });
  });

  describe('addTweet', () => {
    it('should save a tweet with a userHandle and message', async () => {
      await db.addTweet('userHandle', 'message');
      // assert that the tweet is saved
    });
  });

  describe('listTweets', () => {
    it('should return a list of tweets, containing the userHandle, message, and timestamps', async () => {
      const tweets = await db.listTweets();
      // assert that the list of tweets contains the userHandle, message, and timestamps
    });

    it('should order the tweets from newest to oldest', async () => {
      const tweets = await db.listTweets();
      // assert that the tweets are ordered from newest to oldest
    });

    it('should prioritize tweets from the userHandle "elonmusk"', async () => {
      const tweets = await db.listTweets();
      // assert that the tweets from the userHandle "elonmusk" are prioritized
    });
  });
});