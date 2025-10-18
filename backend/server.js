const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;



// Middleware
app.use(cors());
app.use(express.json()); // replaces body-parser for most use cases

// Database connection pool
const pool = new Pool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false, // RDS requires SSL
    },
});

// Example test route
app.get('/', (req, res) => {
  res.send('<h1>NourishLU Backend Running</h1>');
});

// Database test route
app.get('/api/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            connected: true,
            serverTime: result.rows[0].now,
        });
    }
    catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({
            connected: false,
            error: err.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});