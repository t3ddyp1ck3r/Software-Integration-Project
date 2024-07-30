import request from 'supertest';
import { app } from '../index';
import { pool } from '../boot/database/db_connect';

// Mock the pool.query
jest.mock('../boot/database/db_connect', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('Rating Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addRating', () => {
    it('should add a rating successfully', async () => {
      const ratingData = { rating: 5, movieId: '1' };

      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: '1', rating: 5, movie_id: '1' }],
      });

      const res = await request(app).post('/ratings').send(ratingData);

      expect(res.status).toBe(201); // Use 201 for created resource
      expect(res.body).toEqual({
        message: 'Rating added successfully',
        rating: { id: '1', rating: 5, movie_id: '1' },
      });
    });

    it('should return 400 if rating or movieId is missing', async () => {
      const res = await request(app).post('/ratings').send({ rating: 5 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Missing rating or movieId' });
    });

    it('should return 400 if rating is invalid', async () => {
      const res = await request(app)
        .post('/ratings')
        .send({ rating: 6, movieId: '1' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Rating must be between 1 and 5' });
    });

    it('should handle errors while adding rating', async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error('Database error'),
      );

      const res = await request(app)
        .post('/ratings')
        .send({ rating: 5, movieId: '1' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: 'Exception occurred while adding rating',
      });
    });
  });

  describe('deleteRating', () => {
    it('should delete a rating successfully', async () => {
      const ratingId = { ratingId: '1' };

      (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 1 });

      const res = await request(app).delete('/ratings').send(ratingId);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Rating deleted successfully' });
    });

    it('should return 400 if ratingId is missing', async () => {
      const res = await request(app).delete('/ratings').send({});

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Missing ratingId' });
    });

    it('should return 404 if rating is not found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 });

      const res = await request(app)
        .delete('/ratings')
        .send({ ratingId: 'nonexistentId' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Rating not found' });
    });

    it('should handle errors while deleting rating', async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error('Database error'),
      );

      const res = await request(app).delete('/ratings').send({ ratingId: '1' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: 'Exception occurred while deleting rating',
      });
    });
  });
});
