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

//  --------------- Custom Functions ---------------
const { calculateNutrition } = require('./functions/nutritionRec.js');  // For '/api/recommend-meals'
const { generateResponse } = require('./functions/chatbot_functions');  //  Imports chatbot logic from external module

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










// ============================================================================================================
// 3. Backend Routes
// ============================================================================================================

//  --------------- Root Endpoint and Health Check Route ---------------
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

/**
 * @route GET /api/health
 * @description Basic health check for backend service status.
 * @returns {JSON} Service confirmation.
 */
app.get('/api/health', (req, res) => {
    // Return backend status confirmation for uptime checks
    res.json({ status: 'ok', service: 'nourishlu-backend' });
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


// --------------- Create New User Route ---------------
/**
 * @route POST /api/users
 * @description Adds a new user with personal and nutrition-related info
 * @body {string} name - User's name
 * @body {number} height_cm - Height in centimeters
 * @body {number} weight_kg - Weight in kilograms
 * @body {number} age - Age in years
 * @body {string} gender - 'male' or 'female'
 * @body {string} activity_level - 'low', 'moderate', or 'high'
 * @body {string} goal - 'lose', 'maintain', or 'gain'
 */
app.post('/api/users', async (req, res) => {
  try {
    const { name, height_cm, weight_kg, age, gender, activity_level, goal } = req.body;

    // 1️ Validate input
    if (!name || !height_cm || !weight_kg || !age || !gender || !activity_level || !goal) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 2️ Insert user into database
    const insertQuery = `
      INSERT INTO users (name, height_cm, weight_kg, age, gender, activity_level, goal)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING user_id, name, height_cm, weight_kg, age, gender, activity_level, goal;
    `;

    const result = await pool.query(insertQuery, [
      name,
      height_cm,
      weight_kg,
      age,
      gender.toLowerCase(),
      activity_level.toLowerCase(),
      goal.toLowerCase(),
    ]);

    // 3️ Return newly created user info
    res.status(201).json({
      message: 'User successfully created',
      user: result.rows[0],
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// --------------- User Nutrition Routes ---------------
/**
 * @route GET /api/recommend-meals
 * @description Suggests meals that match a user's nutrition needs
 * based on height, weight, age, and goals.
 * @query user_id (int) - The user’s ID in the database
 */
app.get('/api/recommend-meals', async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) return res.status(400).json({ error: 'Missing user_id query parameter' });

    // 1 Get user info
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
    if (userResult.rows.length === 0)
      return res.status(404).json({ error: 'User not found' });

    const user = userResult.rows[0];

    // 2️ Compute personalized nutrition targets
    const { calories, carbs, protein, fat } = calculateNutrition(user);
    const calorieTarget = calories / 3; // assume one meal = ~1/3 daily goal

    // 3️ Smart similarity query
    const mealQuery = `
      SELECT *,
        (POWER(calories - $1, 2)
       + POWER(carbs - $2, 2)
       + POWER(protein - $3, 2)
       + POWER(fat - $4, 2)) AS distance
      FROM meals
      ORDER BY distance ASC
      LIMIT 5;
    `;

    let meals = await pool.query(mealQuery, [
      calorieTarget,
      carbs / 3,
      protein / 3,
      fat / 3,
    ]);

    // 4️ Fallback: if no meals found, return top 5 meals by closest calories
    if (meals.rows.length === 0) {
      meals = await pool.query(
        `SELECT * FROM meals
         ORDER BY ABS(calories - $1)
         LIMIT 5`,
        [calorieTarget]
      );
    }

    // 5️ Send response
    res.json({
      user_goals: {
        daily: { calories, carbs, protein, fat },
        per_meal: {
          calories: Math.round(calorieTarget),
          carbs: Math.round(carbs / 3),
          protein: Math.round(protein / 3),
          fat: Math.round(fat / 3),
        },
      },
      suggested_meals: meals.rows,
    });
  } catch (err) {
    console.error('Recommendation error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @description
 * Calculates daily nutritional recommendations based on user profile data from the frontend.
 * The endpoint expects gender, age, weight, height, and activityLevel in the request body.
 * It computes Basal Metabolic Rate (BMR), applies an activity multiplier to estimate
 * Total Daily Energy Expenditure (TDEE), and returns a macronutrient breakdown.
 *
 * @route POST /api/calculate-nutrition
 * @returns {Object} JSON response containing kcal, fat (g), protein (g), and carbs (g)
 * 
 * @example
 * Request:
 * {
 *   "gender": "male",
 *   "age": "25",
 *   "weight": "70",
 *   "height": "170",
 *   "activityLevel": "moderate"
 * }
 *
 * Response:
 * {
 *   "kcal": 2308,
 *   "fat": 77,
 *   "protein": 144,
 *   "carbs": 260
 * }
 */
app.post('/api/calculate-nutrition', (req, res) => {
    // Extract fields from frontend dropdowns
    const { gender, age, weight, height, activityLevel } = req.body;

    // Default safety checks
    if (!gender || !age || !weight || !height || !activityLevel) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    // Convert values to numbers
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    // Basal Metabolic Rate (BMR)
    let bmr;
    if (gender === "male") {
        bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
        bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    // Activity level multipliers
    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
    };

    // Total Daily Energy Expenditure (TDEE)
    const multiplier = activityMultipliers[activityLevel] || 1.55;
    const tdee = bmr * multiplier;

    // More realistic nutrient breakdown
    const kcal = Math.round(tdee);

    // Protein based on body weight (1.6g per kg)
    const protein = Math.round(w * 1.6);

    // Fat ~25% of total calories
    const fat = Math.round((kcal * 0.25) / 9);

    // Remaining calories go to carbs
    const remainingCalories = kcal - (protein * 4 + fat * 9);
    const carbs = Math.round(remainingCalories / 4);

    // Return result
    res.json({
        kcal,
        protein,
        fat,
        carbs
    });
});


// --------------- Chatbot API Endpoint ---------------
/**
 * @description
 * Handles chat requests between the frontend and Groq API.
 * Routes messages through a primary model and retries fallbacks if needed.
 * Adds contextual grounding to reduce hallucinations.
 *
 * @route POST /api/chat
 * @returns {Object} JSON { success, modelUsed, reply }
 */
app.post('/api/chat', async (req, res) => {
    try {
        //  Extract and validate input message from frontend
        const { message } = req.body;
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

        //  Send final response to frontend
        console.log(`Chat completed using model: ${modelUsed}`);
        res.json({
            success: true,
            modelUsed: modelUsed,
            reply: reply
        });
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});










// ============================================================================================================
// 4. Starting Backend Server
// ============================================================================================================

//  --------------- Server Launch Configuration ---------------
app.listen(PORT, () => {
    // Log server startup details to console
    console.log(`Server is listening at http://localhost:${PORT}`);
});