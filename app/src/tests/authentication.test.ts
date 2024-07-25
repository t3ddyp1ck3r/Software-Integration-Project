import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/authentication';

describe('Authentication Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction = jest.fn();

  beforeEach(() => {
    req = {
      session: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should call next if user is authenticated', () => {
    req.session.user = { _id: '123' };

    authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if user is not authenticated', () => {
    authenticate(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });
});
