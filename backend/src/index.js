"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Get all subjects
app.get('/api/subjects', async (req, res) => {
    try {
        const result = await (0, db_1.query)('SELECT * FROM subjects ORDER BY name ASC');
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});
// Add a subject
app.post('/api/subjects', async (req, res) => {
    const { name, color } = req.body;
    try {
        const result = await (0, db_1.query)('INSERT INTO subjects (name, color) VALUES ($1, $2) RETURNING *', [name, color || '#3498db']);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});
// Record a study session
app.post('/api/sessions', async (req, res) => {
    const { subject_id, duration_seconds, started_at, ended_at } = req.body;
    try {
        const result = await (0, db_1.query)('INSERT INTO study_sessions (subject_id, duration_seconds, started_at, ended_at) VALUES ($1, $2, $3, $4) RETURNING *', [subject_id, duration_seconds, started_at, ended_at]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});
// Get stats
app.get('/api/stats', async (req, res) => {
    try {
        const result = await (0, db_1.query)(`
      SELECT s.name, s.color, SUM(ss.duration_seconds) as total_seconds
      FROM subjects s
      LEFT JOIN study_sessions ss ON s.id = ss.subject_id
      GROUP BY s.id, s.name, s.color
    `);
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});
// Create tables if they don't exist
const initDb = async () => {
    await (0, db_1.query)(`
    CREATE TABLE IF NOT EXISTS subjects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT UNIQUE NOT NULL,
      color TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
    await (0, db_1.query)(`
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
    }
    catch (err) {
        console.error('Failed to initialize database:', err);
    }
});
//# sourceMappingURL=index.js.map