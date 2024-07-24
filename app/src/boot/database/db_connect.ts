import pg from 'pg';
import { logger } from '../../middleware/winston';

const dbConfig: pg.PoolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  max: 10
};

export const pool = new pg.Pool(dbConfig);

pool.on('connect', () => logger.info('PostgreSQL Connected'));
pool.on('error', (err: Error) => {
  logger.error('Unexpected error on idle PostgreSQL client', err);
});
