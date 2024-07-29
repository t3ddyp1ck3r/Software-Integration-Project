import mongoose, { ConnectOptions } from 'mongoose';
import RatingModel from '../models/ratingModel';

describe('Rating Model', () => {
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1/ratingsTestDB?retryWrites=true&w=majority`;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create and save a rating successfully', async () => {
    const ratingData = { rating: 5, movieId: '12345' };
    const validRating = new RatingModel(ratingData);
    const savedRating = await validRating.save();

    expect(savedRating._id).toBeDefined();
    expect(savedRating.rating).toBe(ratingData.rating);
    expect(savedRating.movieId).toBe(ratingData.movieId);
  });

  it('should fail to create a rating without required fields', async () => {
    const ratingData = { rating: '' }; // movieId is missing
    const invalidRating = new RatingModel(ratingData);

    let err;
    try {
      await invalidRating.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        err = error;
      } else {
        console.error('Unexpected error:', error);
      }
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err?.errors.movieId).toBeDefined();
  });
});
