import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../middleware/authentication';

describe('Authentication Middleware', () => {
  it('should call next() if user is authenticated', () => {
    const req = {
      session: {
        user: { _id: '12345' },
      },
    } as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if user is not authenticated', () => {
    const req = {
      session: {},
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });
});
