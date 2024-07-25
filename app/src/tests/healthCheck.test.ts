import { Request, Response } from 'express';
import { healthCheck } from '../middleware/healthCheck';

describe('Health Check Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should return 200 and a success message', () => {
    healthCheck(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'API is healthy' });
  });
});
