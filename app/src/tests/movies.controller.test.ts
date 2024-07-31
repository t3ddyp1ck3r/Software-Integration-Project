import request from 'supertest';
import { app } from '../index';
import MovieModel from '../models/movieModel';

// Mock the MovieModel
jest.mock('../models/movieModel');

describe('Movies Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMovies', () => {
    it('should fetch all movies successfully', async () => {
      const mockMovies = [
        { _id: '1', title: 'Movie 1' },
        { _id: '2', title: 'Movie 2' },
      ];
      (MovieModel.find as jest.Mock).mockResolvedValue(mockMovies);

      const res = await request(app).get('/movies');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockMovies);
    });

    it('should handle errors when fetching all movies', async () => {
      (MovieModel.find as jest.Mock).mockRejectedValue(
        new Error('Error fetching movies'),
      );

      const res = await request(app).get('/movies');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error fetching movies' });
    });
  });

  describe('getTopRatedMovies', () => {
    it('should fetch top-rated movies successfully', async () => {
      const mockTopMovies = [{ _id: '1', title: 'Top Movie 1', rating: 5 }];
      (MovieModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockTopMovies),
        }),
      });

      const res = await request(app).get('/movies/top-rated');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockTopMovies);
    });

    it('should handle errors when fetching top-rated movies', async () => {
      (MovieModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest
            .fn()
            .mockRejectedValue(new Error('Error fetching top-rated movies')),
        }),
      });

      const res = await request(app).get('/movies/top-rated');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error fetching top-rated movies' });
    });
  });

  describe('getSeenMovies', () => {
    it('should fetch seen movies for a user successfully', async () => {
      const mockUser = { _id: 'userId' };
      const mockSeenMovies = [{ _id: '1', title: 'Seen Movie 1' }];
      (MovieModel.find as jest.Mock).mockResolvedValue(mockSeenMovies);

      const res = await request(app)
        .get('/movies/seen')
        .set('Cookie', `session=${JSON.stringify({ user: mockUser })}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockSeenMovies);
    });

    it('should return an empty array if user has no seen movies', async () => {
      const mockUser = { _id: 'userId' };
      (MovieModel.find as jest.Mock).mockResolvedValue([]);

      const res = await request(app)
        .get('/movies/seen')
        .set('Cookie', `session=${JSON.stringify({ user: mockUser })}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]); // Should return an empty array
    });

    it('should return 401 if user is not authenticated', async () => {
      const res = await request(app).get('/movies/seen');
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Unauthorized' });
    });

    it('should handle errors when fetching seen movies', async () => {
      const mockUser = { _id: 'userId' };
      (MovieModel.find as jest.Mock).mockRejectedValue(
        new Error('Error fetching seen movies'),
      );

      const res = await request(app)
        .get('/movies/seen')
        .set('Cookie', `session=${JSON.stringify({ user: mockUser })}`);
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error fetching seen movies' });
    });
  });

  describe('getMovieById', () => {
    it('should fetch a movie by ID successfully', async () => {
      const mockMovie = { _id: '1', title: 'Movie 1' };
      (MovieModel.findById as jest.Mock).mockResolvedValue(mockMovie);

      const res = await request(app).get('/movies/1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockMovie);
    });

    it('should return 404 if the movie is not found', async () => {
      (MovieModel.findById as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/movies/1');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Movie not found' });
    });

    it('should handle errors when fetching a movie by ID', async () => {
      (MovieModel.findById as jest.Mock).mockRejectedValue(
        new Error('Error fetching movie'),
      );

      const res = await request(app).get('/movies/1');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error fetching movie' });
    });
  });
});
