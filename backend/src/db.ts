import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// 연결 풀 에러 핸들링 (서버 다운 방지)
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
