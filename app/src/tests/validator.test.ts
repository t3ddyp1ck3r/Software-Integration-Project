import { Request, Response, NextFunction } from 'express';
import { validateRequest } from '../middleware/validator';

describe('ValidateRequest Middleware', () => {
  it('should call next() if request body is valid', () => {
    const req = {
      body: { name: 'test' },
    } as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    validateRequest(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if request body is invalid', () => {
    const req = {
      body: {},
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    validateRequest(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid request data' });
  });
});
