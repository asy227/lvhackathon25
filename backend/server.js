// ============================================================================================================
// 1. Core Dependencies and Server Configuration
// ============================================================================================================

//  --------------- Dependency Variables ---------------
require('dotenv').config();  //  Loads environment variables from the .env file
const express = require('express');  //  Core framework for building RESTful APIs in Node.js
const cors = require('cors');  //  Enables Cross-Origin Resource Sharing between frontend and backend
const { Pool } = require('pg');  //  PostgreSQL client for connecting and querying an RDS database

//  --------------- Middleware Configuration ---------------
const app = express();  //  Creates an instance of the Express application
const PORT = process.env.PORT || 3000;  //  Defines which port the backend listens on (default 3000)

app.use(cors());  //  Allows frontend requests from different origins (e.g., React app on port 5173)
app.use(express.json());  //  Parses incoming JSON payloads from POST/PUT requests into req.body



// ============================================================================================================
// 2. Database Connection and Chatbot Configuration
// ============================================================================================================

/**
 * @description
 * This section initializes two core backend services:
 *   (1) The PostgreSQL database connection pool (for persistent data storage).
 *   (2) The Hugging Face chatbot integration (for AI text responses).
 *
 * The database uses AWS RDS (PostgreSQL), and the chatbot logic is imported
 * from an external helper file located in `/functions/chatbot_functions.js`.
 */

//  --------------- Database Connection Pool ---------------
const pool = new Pool({
    host: process.env.DB_HOST,  //  The hostname or endpoint of the RDS PostgreSQL instance
    user: process.env.DB_USER,  //  The PostgreSQL username stored in .env
    password: process.env.DB_PASS,  //  The PostgreSQL password stored in .env
    database: process.env.DB_NAME,  //  The name of the database to connect to
    port: process.env.DB_PORT,  //  The port used by PostgreSQL (default: 5432)
    ssl: {
        rejectUnauthorized: false  //  Allows SSL without verifying AWS certificate chain
    }
});


//  --------------- Chatbot Functions (Groq API Integration) ---------------
const { generateResponse } = require('./functions/chatbot_functions');  //  Imports chatbot logic from external module



// ============================================================================================================
// 3. Backend Routes
// ============================================================================================================

//  --------------- Root Endpoint ---------------
/**
 * @route GET /
 * @description Basic route that confirms the backend is running.
 * Used for quick browser checks or EC2 uptime validation.
 * @returns {HTML} A static confirmation message.
 */
app.get('/', (req, res) => {
    // Send a static HTML confirmation message to confirm server is live
    res.send('<h1>NourishLU Backend Running</h1>');
});


//  --------------- Database Testing Route ---------------
/**
 * @route GET /api/db-test
 * @description Tests connectivity to the PostgreSQL database by executing `SELECT NOW()`.
 * This helps confirm that environment variables and RDS credentials are configured properly.
 * @returns {JSON} Connection status and the current database server timestamp.
 */
app.get('/api/db-test', async (req, res) => {
    try {
        // Execute test query to verify PostgreSQL connectivity
        const result = await pool.query('SELECT NOW()');  //  Simple SQL query to confirm DB connection

        // Send JSON response back to frontend
        res.json({
            connected: true,  //  Indicates that the connection was successful
            serverTime: result.rows[0].now  //  Returns the current timestamp from the database
        });
    }
    catch (err) {
        // Handle and log any database connection errors
        console.error('Database connection error:', err);
        res.status(500).json({
            connected: false,  //  Indicates failure to connect
            error: err.message  //  Provides readable error message for frontend debugging
        });
    }
});


//  --------------- Chatbot Endpoint ---------------
/**
 * @route POST /api/chat
 * @description Accepts a message from the frontend and sends it to the Groq API.
 *              Automatically retries using fallback models if the primary model is unavailable.
 *              Returns the model’s generated response as JSON for use in the chatbot interface.
 * @returns {JSON} Chatbot reply, success status, and model used.
 */
app.post('/api/chat', async (req, res) => {
    try {
        //  Extract and validate input message from frontend
        const { message } = req.body;  //  Extract user message from request body
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ success: false, error: 'Missing or invalid "message" field.' });
        }

        //  Ensure the Groq API key is available
        if (!process.env.GROQ_API_KEY) {
            return res.status(400).json({ success: false, error: 'Missing Groq API key in environment.' });
        }

        //  Retrieve model list from environment and fallback options
        const primaryModel = process.env.LLM_MODEL || 'llama-3.1-8b-instant';
        const fallbackModels = [
            'llama-3.1-70b-versatile',
            'mixtral-8x7b',
            'gemma2-9b-it'
        ];

        //  Attempt generation with primary model, then try fallbacks
        let reply = '(no response)';
        let modelUsed = primaryModel;

        async function attemptChat(model) {
            try {
                const { generateResponse } = require('./functions/chatbot_functions');
                return await generateResponse(message, model);
            } catch (error) {
                console.warn(`Chat attempt with model "${model}" failed:`, error.message);
                return null;
            }
        }

        //  First attempt with primary model
        let result = await attemptChat(primaryModel);
        if (result && result !== '(no response)') {
            reply = result;
        } else {
            //  Try each fallback model sequentially
            for (const fallback of fallbackModels) {
                console.log(`Retrying chat with fallback model: ${fallback}`);
                result = await attemptChat(fallback);
                if (result && result !== '(no response)') {
                    reply = result;
                    modelUsed = fallback;
                    break;
                }
            }
        }

        //  Send final response to frontend with model info
        console.log(`Chat completed using model: ${modelUsed}`);
        res.json({
            success: true,
            modelUsed: modelUsed,
            reply: reply
        });
    }
    catch (error) {
        //  Handle unexpected runtime or API errors
        console.error('Chat API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


//  --------------- Health Check Route ---------------
/**
 * @route GET /api/health
 * @description Basic health check for backend service status.
 * @returns {JSON} Service confirmation.
 */
app.get('/api/health', (req, res) => {
    // Return backend status confirmation for uptime checks
    res.json({ status: 'ok', service: 'nourishlu-backend' });
});



// ============================================================================================================
// 4. Starting Backend Server
// ============================================================================================================

//  --------------- Server Launch Configuration ---------------
app.listen(PORT, () => {
    // Log server startup details to console
    console.log(`Server is listening at http://localhost:${PORT}`);
});