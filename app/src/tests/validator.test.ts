import { Request, Response, NextFunction } from 'express';
import { validateRequest } from '../middleware/validator';

describe('Validator Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction = jest.fn();

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should call next if validation passes', () => {
    req.body = { name: 'Test' };

    validateRequest(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if validation fails', () => {
    validateRequest(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid request data' });
  });
});
