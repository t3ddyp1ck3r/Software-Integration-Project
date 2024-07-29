import { Pool } from 'pg';
import { logger } from '../middleware/winston';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  max: 10,
});

pool.on('connect', () => {
  logger.info('PostgreSQL Connected');
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

export { pool };
