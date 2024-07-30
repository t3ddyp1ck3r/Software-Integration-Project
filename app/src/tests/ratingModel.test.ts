import mongoose from 'mongoose';
import RatingModel from '../models/ratingModel';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.release' });

describe('RatingModel', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create a rating successfully', async () => {
    const ratingData = { rating: 4, movieId: '1' };
    const rating = new RatingModel(ratingData);

    const savedRating = await rating.save();

    expect(savedRating._id).toBeDefined();
    expect(savedRating.rating).toBe(ratingData.rating);
    expect(savedRating.movieId).toBe(ratingData.movieId);
  });

  it('should require rating and movieId', async () => {
    const ratingData = { rating: null, movieId: '' };
    const rating = new RatingModel(ratingData);

    await expect(rating.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });
});
