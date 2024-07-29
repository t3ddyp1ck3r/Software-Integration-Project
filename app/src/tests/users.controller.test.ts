import { Request, Response } from 'express';
import { getUser, deleteUser } from '../controllers/users.controller';
import userModel from '../models/userModel';
import { statusCodes } from '../constants/statusCodes';

jest.mock('../models/userModel');

describe('Users Controller', () => {
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

  describe('getUser', () => {
    it('should return 400 if userId is missing', async () => {
      req.body = { userId: '' };

      await getUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(json).toHaveBeenCalledWith({ message: 'Missing userId' });
    });

    it('should return 200 if user is found', async () => {
      req.body = { userId: '12345' };

      (userModel.findById as jest.Mock).mockResolvedValueOnce({ _id: '12345', username: 'testuser' });

      await getUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.success);
      expect(json).toHaveBeenCalledWith(expect.objectContaining({ username: 'testuser' }));
    });

    it('should handle database errors', async () => {
      req.body = { userId: '12345' };

      (userModel.findById as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await getUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.queryError);
      expect(json).toHaveBeenCalledWith({ error: 'Failed to get user' });
    });
  });

  describe('deleteUser', () => {
    it('should return 400 if userId is missing', async () => {
      req.body = { userId: '' };

      await deleteUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(json).toHaveBeenCalledWith({ message: 'Missing userId' });
    });

    it('should return 200 if user is deleted successfully', async () => {
      req.body = { userId: '12345' };

      (userModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce({ _id: '12345' });

      await deleteUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.success);
      expect(json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('should handle database errors', async () => {
      req.body = { userId: '12345' };

      (userModel.findByIdAndDelete as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await deleteUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCodes.queryError);
      expect(json).toHaveBeenCalledWith({ error: 'Failed to delete user' });
    });
  });
});
