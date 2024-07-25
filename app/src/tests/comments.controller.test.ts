import { Request, Response } from 'express';
import { addComment, deleteComment } from '../controllers/comments.controller';
import { pool } from '../boot/database/db_connect';
import { statusCodes } from '../constants/statusCodes';

jest.mock('../boot/database/db_connect');

describe('Comments Controller', () => {
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

  describe('addComment', () => {
    it('should return 400 if content is missing', async () => {
      req.body = { content: '' };

      await addComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(json).toHaveBeenCalledWith({ message: 'Missing content' });
    });

    it('should return 200 and add comment if content is provided', async () => {
      req.body = { content: 'This is a test comment', postId: 1 };

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await addComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.success);
      expect(json).toHaveBeenCalledWith({ message: 'Comment added successfully' });
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO comments (content, post_id) VALUES ($1, $2) RETURNING *;",
        ['This is a test comment', 1]
      );
    });

    it('should handle database errors', async () => {
      req.body = { content: 'This is a test comment', postId: 1 };

      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await addComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.queryError);
      expect(json).toHaveBeenCalledWith({ error: 'Exception occurred while adding comment' });
    });
  });

  describe('deleteComment', () => {
    it('should return 400 if commentId is missing', async () => {
      req.body = { commentId: '' };

      await deleteComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(json).toHaveBeenCalledWith({ message: 'Missing commentId' });
    });

    it('should return 200 and delete comment if commentId is provided', async () => {
      req.body = { commentId: 1 };

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1 }] });

      await deleteComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.success);
      expect(json).toHaveBeenCalledWith({ message: 'Comment deleted successfully' });
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM comments WHERE id = $1 RETURNING *;",
        [1]
      );
    });

    it('should handle database errors', async () => {
      req.body = { commentId: 1 };

      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await deleteComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.queryError);
      expect(json).toHaveBeenCalledWith({ error: 'Exception occurred while deleting comment' });
    });
  });
});
