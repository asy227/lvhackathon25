// ============================================================================================================
// 1. Setting up Essential Backend Variables
// ============================================================================================================

require('dotenv').config()  // Loads environment variables from the .env file into process.env
const express = require('express')  // Core framework for building RESTful APIs in Node.js
const cors = require('cors')  // Enables Cross-Origin Resource Sharing between frontend and backend
const { Pool } = require('pg')  // PostgreSQL client for connecting and querying an RDS database

const app = express()  // Creates an instance of the Express application
const PORT = process.env.PORT || 3000  // Defines which port the backend listens on (default 3000)












// ============================================================================================================
// 2. Middleware Configuration
// ============================================================================================================

app.use(cors())  // Allows frontend requests from different origins (e.g., React app on port 5173)
app.use(express.json())  // Parses incoming JSON payloads from POST/PUT requests into req.body












// ============================================================================================================
// 3. Database Connection Pool (AWS RDS - PostgreSQL)
// ============================================================================================================

/**
 * @description
 * Creates a reusable connection pool to the PostgreSQL database hosted on AWS RDS.
 * Using a pool improves performance by keeping open connections available instead of reconnecting each time.
 * The `ssl` configuration is required for RDS instances and disables certificate verification for simplicity.
 */
const pool = new Pool({
    host: process.env.DB_HOST,  // The hostname or endpoint of the RDS PostgreSQL instance
    user: process.env.DB_USER,  // The PostgreSQL username stored in .env
    password: process.env.DB_PASS,  // The PostgreSQL password stored in .env
    database: process.env.DB_NAME,  // The name of the database to connect to
    port: process.env.DB_PORT,  // The port used by PostgreSQL (default: 5432)
    ssl: {
        rejectUnauthorized: false  // Allows SSL without verifying AWS certificate chain
    }
})












// ============================================================================================================
// 4. Defining Backend Routes
// ============================================================================================================

/**
 * @route GET /
 * @description Basic route that confirms the backend is running.
 * Used for quick browser checks or EC2 uptime validation.
 * @returns {HTML} A static confirmation message.
 */
app.get('/', (req, res) => {
    res.send('<h1>NourishLU Backend Running</h1>')  // Responds with a simple HTML message
})



/**
 * @route GET /api/db-test
 * @description Tests connectivity to the PostgreSQL database by executing `SELECT NOW()`.
 * This helps confirm that environment variables and RDS credentials are configured properly.
 * @returns {JSON} Connection status and the current database server timestamp.
 */
app.get('/api/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()')  // Executes a basic SQL query to fetch the current time
        res.json({
            connected: true,  // Indicates successful database connection
            serverTime: result.rows[0].now  // Returns current PostgreSQL server timestamp
        })
    } 
    catch (err) {
        console.error('Database connection error:', err)  // Logs error details for debugging
        res.status(500).json({
            connected: false,  // Indicates failure to connect
            error: err.message  // Returns readable error message for frontend debugging
        })
    }
})












// ============================================================================================================
// 5. Starting Backend Server
// ============================================================================================================

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`)  // Confirms that backend is live and listening
})