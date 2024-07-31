import { Request, Response, NextFunction } from 'express';
import { notFound } from '../middleware/notFound';

describe('NotFound Middleware', () => {
  it('should return status 404 with message Not Found', () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    notFound(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not Found' });
  });
});
