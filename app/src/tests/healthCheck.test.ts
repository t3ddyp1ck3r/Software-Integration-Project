import { Request, Response } from 'express';
import { healthCheck } from '../middleware/healthCheck';

describe('HealthCheck Middleware', () => {
  it('should return status 200 with status OK', () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    healthCheck(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'OK' });
  });
});
