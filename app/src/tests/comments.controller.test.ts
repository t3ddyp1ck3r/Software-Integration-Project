import request from 'supertest';
import { app } from '../index';
import CommentModel from '../models/commentModel';

// Mock the CommentModel
jest.mock('../models/commentModel');

describe('Comments Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCommentsById', () => {
    it('should get comments by movie ID successfully', async () => {
      const mockComments = [
        { _id: 'commentId1', content: 'Great movie!', author: 'userId1' },
        { _id: 'commentId2', content: 'Not bad.', author: 'userId2' },
      ];
      (CommentModel.find as jest.Mock).mockResolvedValue(mockComments);

      const res = await request(app).get('/comments/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockComments);
    });

    it('should return 400 if movie ID is not provided', async () => {
      const res = await request(app).get('/comments/');

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Movie ID is required' });
    });

    it('should return 200 with an empty array if no comments found', async () => {
      (CommentModel.find as jest.Mock).mockResolvedValue([]);

      const res = await request(app).get('/comments/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]); // Should return an empty array if no comments found
    });

    it('should handle errors when fetching comments', async () => {
      (CommentModel.find as jest.Mock).mockRejectedValue(
        new Error('Error fetching comments'),
      );

      const res = await request(app).get('/comments/1');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error fetching comments' });
    });
  });

  describe('addComment', () => {
    it('should add a comment successfully', async () => {
      const mockComment = {
        _id: 'commentId',
        content: 'Great movie!',
        author: 'userId1',
      };
      (CommentModel.prototype.save as jest.Mock).mockResolvedValue(mockComment);

      const res = await request(app)
        .post('/comments/1')
        .send({ content: 'Great movie!', author: 'userId1' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockComment);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/comments/1')
        .send({ content: '', author: 'userId1' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Missing required fields' });
    });

    it('should return 400 if movie ID is not provided', async () => {
      const res = await request(app).post('/comments/').send({
        content: 'Great movie!',
        author: 'userId1',
      });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Movie ID is required' });
    });

    it('should handle errors when adding a comment', async () => {
      (CommentModel.prototype.save as jest.Mock).mockRejectedValue(
        new Error('Error adding comment'),
      );

      const res = await request(app)
        .post('/comments/1')
        .send({ content: 'Great movie!', author: 'userId1' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error adding comment' });
    });
  });
});
