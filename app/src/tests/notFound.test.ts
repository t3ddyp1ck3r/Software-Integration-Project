import { Request, Response, NextFunction } from 'express';
import { notFound } from '../middleware/notFound';

describe('Not Found Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction = jest.fn();

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should return 404 and a not found message', () => {
    notFound(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not Found' });
  });
});
