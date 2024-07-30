import { Pool } from 'pg';
import { logger } from '../../middleware/winston';

const pool = new Pool({
  user: process.env.PGUSER || process.env.DB_USER,
  host: process.env.PGHOST || process.env.DB_HOST,
  database: process.env.PGDATABASE || process.env.DB_NAME,
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
  port: parseInt(process.env.PGPORT || '5432', 10),
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
