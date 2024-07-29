import { Request, Response } from 'express';
import { sendMessage, deleteMessage } from '../controllers/messages.controller';
import { pool } from '../boot/database/db_connect';
import { statusCodes } from '../constants/statusCodes';

jest.mock('../boot/database/db_connect', () => {
  const mPool = {
    query: jest.fn(),
  };
  return { pool: mPool };
});

describe('Messages Controller', () => {
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

  describe('sendMessage', () => {
    it('should return 400 if content is missing', async () => {
      req.body = { content: '' };

      await sendMessage(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(json).toHaveBeenCalledWith({ message: 'Missing content' });
    });

    it('should return 200 and send message if content is provided', async () => {
      req.body = { content: 'This is a test message', recipientId: 1 };

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await sendMessage(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.success);
      expect(json).toHaveBeenCalledWith({ message: 'Message sent successfully' });
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO messages (content, recipient_id) VALUES ($1, $2) RETURNING *;",
        ['This is a test message', 1]
      );
    });

    it('should handle database errors', async () => {
      req.body = { content: 'This is a test message', recipientId: 1 };

      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await sendMessage(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.queryError);
      expect(json).toHaveBeenCalledWith({ error: 'Exception occurred while sending message' });
    });
  });

  describe('deleteMessage', () => {
    it('should return 400 if messageId is missing', async () => {
      req.body = { messageId: '' };

      await deleteMessage(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(json).toHaveBeenCalledWith({ message: 'Missing messageId' });
    });

    it('should return 200 and delete message if messageId is provided', async () => {
      req.body = { messageId: 1 };

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1 }] });

      await deleteMessage(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.success);
      expect(json).toHaveBeenCalledWith({ message: 'Message deleted successfully' });
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM messages WHERE id = $1 RETURNING *;",
        [1]
      );
    });

    it('should handle database errors', async () => {
      req.body = { messageId: 1 };

      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await deleteMessage(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.queryError);
      expect(json).toHaveBeenCalledWith({ error: 'Exception occurred while deleting message' });
    });
  });
});
