import express, { Request, Response } from 'express';
import cors from 'cors';
import { query } from './db.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get all subjects
app.get('/api/subjects', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM subjects ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add a subject
app.post('/api/subjects', async (req: Request, res: Response) => {
  const { name, color } = req.body;
  try {
    const result = await query(
      'INSERT INTO subjects (name, color) VALUES ($1, $2) RETURNING *',
      [name, color || '#3498db']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Record a study session
app.post('/api/sessions', async (req: Request, res: Response) => {
  const { subject_id, duration_seconds, started_at, ended_at } = req.body;
  try {
    const result = await query(
      'INSERT INTO study_sessions (subject_id, duration_seconds, started_at, ended_at) VALUES ($1, $2, $3, $4) RETURNING *',
      [subject_id, duration_seconds, started_at, ended_at]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get stats
app.get('/api/stats', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT s.name, s.color, SUM(ss.duration_seconds) as total_seconds
      FROM subjects s
      LEFT JOIN study_sessions ss ON s.id = ss.subject_id
      GROUP BY s.id, s.name, s.color
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create tables if they don't exist
const initDb = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS subjects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT UNIQUE NOT NULL,
      color TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS study_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      subject_id UUID REFERENCES subjects(id),
      duration_seconds INTEGER NOT NULL,
      started_at TIMESTAMP NOT NULL,
      ended_at TIMESTAMP NOT NULL
    );
  `);
  console.log('Database initialized');
};

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  try {
    await initDb();
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
});
