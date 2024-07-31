import mongoose from 'mongoose';
import MovieModel from '../models/movieModel';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.release' });

describe('MovieModel', () => {
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

  it('should create a movie successfully', async () => {
    const movieData = {
      title: 'Movie Title',
      description: 'Movie Description',
      rating: 5,
      seenBy: [],
    };
    const movie = new MovieModel(movieData);

    const savedMovie = await movie.save();

    expect(savedMovie._id).toBeDefined();
    expect(savedMovie.title).toBe(movieData.title);
    expect(savedMovie.description).toBe(movieData.description);
    expect(savedMovie.rating).toBe(movieData.rating);
    expect(savedMovie.seenBy).toEqual(movieData.seenBy);
  });

  it('should require title, description, and rating', async () => {
    const movieData = { title: '', description: '', rating: null, seenBy: [] };
    const movie = new MovieModel(movieData);

    await expect(movie.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });
});
