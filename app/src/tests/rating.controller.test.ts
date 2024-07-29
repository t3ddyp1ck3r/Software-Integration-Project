import { Request, Response } from 'express';
import { addRating, deleteRating } from '../controllers/rating.controller';
import { pool } from '../boot/database/db_connect';
import { statusCodes } from '../constants/statusCodes';

jest.mock('../boot/database/db_connect', () => {
  const mPool = {
    query: jest.fn(),
  };
  return { pool: mPool };
});

describe('Rating Controller', () => {
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

  describe('addRating', () => {
    it('should return 400 if rating is missing', async () => {
      req.body = { rating: '' };

      await addRating(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(json).toHaveBeenCalledWith({ message: 'Missing rating' });
    });

    it('should return 200 and add rating if rating is provided', async () => {
      req.body = { rating: 5, movieId: 1 };

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await addRating(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.success);
      expect(json).toHaveBeenCalledWith({ message: 'Rating added successfully' });
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO ratings (rating, movie_id) VALUES ($1, $2) RETURNING *;",
        [5, 1]
      );
    });

    it('should handle database errors', async () => {
      req.body = { rating: 5, movieId: 1 };

      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await addRating(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.queryError);
      expect(json).toHaveBeenCalledWith({ error: 'Exception occurred while adding rating' });
    });
  });

  describe('deleteRating', () => {
    it('should return 400 if ratingId is missing', async () => {
      req.body = { ratingId: '' };

      await deleteRating(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(json).toHaveBeenCalledWith({ message: 'Missing ratingId' });
    });

    it('should return 200 and delete rating if ratingId is provided', async () => {
      req.body = { ratingId: 1 };

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1 }] });

      await deleteRating(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.success);
      expect(json).toHaveBeenCalledWith({ message: 'Rating deleted successfully' });
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM ratings WHERE id = $1 RETURNING *;",
        [1]
      );
    });

    it('should handle database errors', async () => {
      req.body = { ratingId: 1 };

      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await deleteRating(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.queryError);
      expect(json).toHaveBeenCalledWith({ error: 'Exception occurred while deleting rating' });
    });
  });
});
