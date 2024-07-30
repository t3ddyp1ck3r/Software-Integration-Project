import { Request, Response, NextFunction } from 'express';

export const validator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body && req.body.name) {
    next();
  } else {
    res.status(400).json({ error: 'Invalid request data' });
  }
};
