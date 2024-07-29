import { Request, Response } from 'express';
import { signup, signin, getUser, logout } from '../controllers/auth.controller';
import { pool } from '../boot/database/db_connect';
import { statusCodes } from '../constants/statusCodes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../boot/database/db_connect');

describe('Auth Controller', () => {
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

  describe('signup', () => {
    it('should return 400 if username, email, or password is missing', async () => {
      req.body = { username: '', email: '', password: '' };

      await signup(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ error: 'missing information' });
    });

    it('should return 200 if user is created successfully', async () => {
      req.body = { username: 'testuser', email: 'testuser@example.com', password: 'password123' };

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{}] });

      await signup(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(expect.objectContaining({ username: 'testuser' }));
    });

    it('should handle database errors', async () => {
      req.body = { username: 'testuser', email: 'testuser@example.com', password: 'password123' };

      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await signup(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ message: 'failed to save user' });
    });
  });

});
