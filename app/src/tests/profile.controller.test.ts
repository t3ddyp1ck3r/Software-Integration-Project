import { Request, Response } from 'express';
import { editPassword, logout } from '../controllers/profile.controller';
import { pool } from '../boot/database/db_connect';
import { logger } from '../middleware/winston';
import { statusCodes } from '../constants/statusCodes';

jest.mock('../boot/database/db_connect');
jest.mock('../middleware/winston');

describe('Profile Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json = jest.fn();
  let status = jest.fn().mockReturnValue({ json });

  beforeEach(() => {
    req = {
      body: {},
      user: { email: 'test@example.com' },
      session: {}
    };
    res = {
      status
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('editPassword', () => {
    it('should return 400 if oldPassword or newPassword is missing', async () => {
      req.body = { oldPassword: '', newPassword: '' };

      await editPassword(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(json).toHaveBeenCalledWith({ message: 'Missing parameters' });
    });

    it('should return 400 if oldPassword is the same as newPassword', async () => {
      req.body = { oldPassword: 'password123', newPassword: 'password123' };

      await editPassword(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(json).toHaveBeenCalledWith({ message: 'New password cannot be equal to old password' });
    });

    it('should return 400 if old password is incorrect', async () => {
      req.body = { oldPassword: 'wrongpassword', newPassword: 'newpassword' };

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await editPassword(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(json).toHaveBeenCalledWith({ message: 'Incorrect password' });
    });

    it('should return 200 if password is updated successfully', async () => {
      req.body = { oldPassword: 'oldpassword', newPassword: 'newpassword' };

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ email: 'test@example.com' }] });
      (pool.query as jest.Mock).mockResolvedValueOnce({});

      await editPassword(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.success);
      expect(json).toHaveBeenCalledWith({ message: 'Password updated' });
    });

    it('should handle database errors', async () => {
      req.body = { oldPassword: 'oldpassword', newPassword: 'newpassword' };

      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await editPassword(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.queryError);
      expect(json).toHaveBeenCalledWith({ error: 'Exception occurred while updating password' });
      expect(logger.error).toHaveBeenCalledWith(expect.any(String));
    });
  });

  describe('logout', () => {
    it('should return 200 if user is logged out', () => {
      req.session = { user: 'testUser' };

      logout(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ message: 'Disconnected' });
    });

    it('should return 200 if there is no active session', () => {
      logout(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ message: 'Disconnected' });
    });
  });
});
