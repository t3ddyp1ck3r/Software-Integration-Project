import { Request, Response } from 'express';
import { addMovie, deleteMovie } from '../controllers/movies.controller';
import { pool } from '../boot/database/db_connect';
import { statusCodes } from '../constants/statusCodes';

jest.mock('../boot/database/db_connect', () => {
  const mPool = {
    query: jest.fn(),
  };
  return { pool: mPool };
});

describe('Movies Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json = jest.fn();
  let status = jest.fn().mockReturnValue({ json });

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addMovie', () => {
    it('should return 400 if title is missing', async () => {
      req.body = { title: '' };

      await addMovie(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(json).toHaveBeenCalledWith({ message: 'Missing title' });
    });

    it('should return 200 and add movie if title is provided', async () => {
      req.body = { title: 'Test Movie', description: 'A test movie' };

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await addMovie(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.success);
      expect(json).toHaveBeenCalledWith({ message: 'Movie added successfully' });
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO movies (title, description) VALUES ($1, $2) RETURNING *;",
        ['Test Movie', 'A test movie']
      );
    });

    it('should handle database errors', async () => {
      req.body = { title: 'Test Movie', description: 'A test movie' };

      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await addMovie(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.queryError);
      expect(json).toHaveBeenCalledWith({ error: 'Exception occurred while adding movie' });
    });
  });

  describe('deleteMovie', () => {
    it('should return 400 if movieId is missing', async () => {
      req.body = { movieId: '' };

      await deleteMovie(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(json).toHaveBeenCalledWith({ message: 'Missing movieId' });
    });

    it('should return 200 and delete movie if movieId is provided', async () => {
      req.body = { movieId: 1 };

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1 }] });

      await deleteMovie(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.success);
      expect(json).toHaveBeenCalledWith({ message: 'Movie deleted successfully' });
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM movies WHERE id = $1 RETURNING *;",
        [1]
      );
    });

    it('should handle database errors', async () => {
      req.body = { movieId: 1 };

      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await deleteMovie(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.queryError);
      expect(json).toHaveBeenCalledWith({ error: 'Exception occurred while deleting movie' });
    });
  });
});
