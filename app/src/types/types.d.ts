import 'express-session';
import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any; // Define more strictly depending on your user model
    session?: Express.Session;
  }
}
