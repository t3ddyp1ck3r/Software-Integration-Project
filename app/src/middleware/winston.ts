import winston from 'winston';
import { StreamOptions } from 'morgan';

const options = {
  file: {
    level: 'info',
    filename: './logs/app.log',
    handleExceptions: true,
    maxsize: 5242880, 
    maxFiles: 5,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false,
});

const stream: StreamOptions = {
  write: (message: string): void => {
    logger.info(message.trim());
  },
};

export { logger, stream };
