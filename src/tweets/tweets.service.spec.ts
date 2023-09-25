import { Test, TestingModule } from '@nestjs/testing';
import { TweetsService } from './tweets.service';

describe('TweetsService', () => {
  let service: TweetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TweetsService],
    }).compile();

    service = module.get<TweetsService>(TweetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create tweet', () => {
    it('should create tweet', () => {
      service.tweets = [];

      const payload = 'This is my tweet';

      const tweet = service.createTweet(payload);
      expect(tweet).toBe(payload);
      expect(service.tweets).toHaveLength(1);
    });

    it('should prevent tweets over 100 characters length to be created', () => {
      const payload = `
      This is a tweet with over 100 characters 
      This is a tweet with over 100 characters
      This is a tweet with over 100 characters
      This is a tweet with over 100 characters
      This is a tweet with over 100 characters 
      This is a tweet with over 100 characters
      This is a tweet with over 100 characters
      This is a tweet with over 100 characters
      This is a tweet with over 100 characters
      `;

      const tweet = () => service.createTweet(payload);

      expect(tweet).toThrowError();
    });
  });

  describe('Get tweet', () => {
    it('should get all tweets', () => {
      const payload = `This is my tweet`;
      service.createTweet(payload);

      const tweets = service.getTweets();

      expect(tweets).toBeInstanceOf(Array);
      expect(tweets).toHaveLength(1);
    });
  });

  describe('Edit tweet', () => {
    it('should edit a tweet', () => {
      const payload = `This is my tweet`;

      service.createTweet(payload);

      const newText = 'This is tweet that has been updated';
      const updatedTweet = service.updateTweet(newText, 0);

      expect(updatedTweet).toBe(newText);
    });
    it(`should prevent an edit of a tweet that doesn't exist`, () => {
      const payload = `This is my tweet`;

      service.createTweet(payload);

      const newText = 'This is tweet that has been updated';
      const updateTweet = () => service.updateTweet(newText, 9);

      expect(updateTweet).toThrowError(`This tweet does not exist`);
    });

    it('should prevent an edit of a tweet that is too long', () => {
      const payload = 'This is my tweet';
      service.createTweet(payload);

      const newText = `
      This is a tweet with over 100 characters 
      This is a tweet with over 100 characters
      This is a tweet with over 100 characters
      This is a tweet with over 100 characters
      This is a tweet with over 100 characters 
      This is a tweet with over 100 characters
      This is a tweet with over 100 characters
      This is a tweet with over 100 characters
      This is a tweet with over 100 characters
      This is a tweet with over 100 characters
      `;

      const updateTweet = () => service.updateTweet(newText, 0);

      expect(updateTweet).toThrowError(`Tweet too long`);
    });

    describe('Delete tweet', () => {
      it(`should prevent delete a tweet that doesn't exist`, () => {
        const deleteTweet = () => service.deleteTweet(0);

        expect(deleteTweet).toThrowError(`This tweet does not exist`);
      });
      it(`should delete a tweet`, () => {
        const payload = `This is my tweet`;

        service.createTweet(payload);

        const deletedTweet = service.deleteTweet(0);

        expect(deletedTweet).toBe(payload);
        expect(service.tweets).toHaveLength(0);
      });
    });
  });
});
