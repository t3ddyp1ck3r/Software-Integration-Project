import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import morgan from 'morgan';
import { logger, stream } from '../middleware/winston';
import { notFound } from '../middleware/notFound';
import { healthCheck } from '../middleware/healthCheck';
import { authenticate } from '../middleware/authentication';
import { validateRequest } from '../middleware/validator';

// ROUTES
import authRoutes from '../routes/auth.routes';
import messageRoutes from '../routes/messages.routes';
import usersRoutes from '../routes/users.routes';
import profileRoutes from '../routes/profile.routes';
import moviesRoutes from '../routes/movies.routes';
import ratingRoutes from '../routes/rating.routes';
import commentsRoutes from '../routes/comments.routes';

const PORT = process.env.PORT || 8080;
const app = express();

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI environment variable is not defined");
}

try {
  mongoose.connect(mongoUri);
  logger.info("MongoDB Connected");
} catch (error) {
  logger.error("Error connecting to DB" + error);
}

// MIDDLEWARE
const registerCoreMiddleWare = () => {
  try {
    // using our session
    app.use(
      session({
        secret: '1234',
        resave: false,
        saveUninitialized: true,
        cookie: {
          secure: false,
          httpOnly: true,
        },
      }),
    );

    app.use(morgan('combined', { stream }));
    app.use(express.json()); // returning middleware that only parses JSON
    app.use(cors({})); // enabling CORS
    app.use(helmet()); // enabling helmet -> setting response headers

    app.use(validateRequest);
    app.use(healthCheck);

    app.use('/auth', authRoutes);
    app.use('/users', usersRoutes);

    // Route registration
    app.use('/messages', authenticate, messageRoutes);
    app.use('/profile', authenticate, profileRoutes);
    app.use('/movies', authenticate, moviesRoutes);
    app.use('/ratings', authenticate, ratingRoutes);
    app.use('/comments', authenticate, commentsRoutes);

    // 404 handling for not found
    app.use(notFound);

    logger.http('Done registering all middlewares');
  } catch (err) {
    logger.error('Error thrown while executing registerCoreMiddleWare');
    process.exit(1);
  }
};

// handling uncaught exceptions
const handleError = () => {
  process.on('uncaughtException', (err) => {
    logger.error(`UNCAUGHT_EXCEPTION OCCURRED: ${JSON.stringify(err.stack)}`);
  });
};

// start application
const startApp = () => {
  try {
    // register core application level middleware
    registerCoreMiddleWare();

    app.listen(PORT, () => {
      logger.info('Listening on 127.0.0.1:' + PORT);
    });

    // exit on uncaught exception
    handleError();
  } catch (err) {
    logger.error(
      `startup :: Error while booting the application ${JSON.stringify(
        err,
        undefined,
        2,
      )}`,
    );
    throw err;
  }
};

export { startApp };
