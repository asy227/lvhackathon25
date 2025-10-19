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
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
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
app.post('/api/recommend-meals', async (req, res) => {
  try {
    const { user_id, goals } = req.body;
    if (!user_id) {
      return res.status(400).json({ error: 'Missing user_id in request body' });
    }

    console.log('Received goals:', goals);

    // Step 1: Get user info
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Step 2: Compute personalized nutrition targets
    const { calories, carbs, protein, fat } = calculateNutrition(user);
    const calorieTarget = calories / 3;

    // Step 3: Build query with numeric casting
    let mealQuery = `
      SELECT *,
        (
          POWER(CAST(calories AS FLOAT) - $1, 2) +
          POWER(CAST(carbs AS FLOAT) - $2, 2) +
          POWER(CAST(protein AS FLOAT) - $3, 2) +
          POWER(CAST(fat AS FLOAT) - $4, 2)
        ) AS distance
      FROM meals
    `;

    // Step 4: Apply filters dynamically
    const filters = [];
    if (goals?.includes("High Protein")) filters.push("protein >= 30");
    if (goals?.includes("Low Protein")) filters.push("protein <= 15");
    if (goals?.includes("Low Carb")) filters.push("carbs <= 40");
    if (goals?.includes("High Carb")) filters.push("carbs >= 80");
    if (goals?.includes("Low Cost")) filters.push("price <= 10");
    if (goals?.includes("High Cost")) filters.push("price >= 12");
    if (goals?.includes("Vegetarian")) filters.push("tags ILIKE '%vegetarian%'");
    if (goals?.includes("Vegan")) filters.push("tags ILIKE '%vegan%'");

    if (filters.length > 0) {
      mealQuery += " WHERE " + filters.join(" AND ");
    }

    mealQuery += `
      ORDER BY distance ASC
      LIMIT 5;
    `;

    // Step 5: Execute query
    const meals = await pool.query(mealQuery, [
      calorieTarget,
      carbs / 3,
      protein / 3,
      fat / 3,
    ]);

    // Step 6: Fallback if no matches found
    if (meals.rows.length === 0) {
      const fallback = await pool.query(
        `SELECT * FROM meals ORDER BY ABS(CAST(calories AS FLOAT) - $1) LIMIT 5`,
        [calorieTarget]
      );
      return res.json({ suggested_meals: fallback.rows });
    }

    // Step 7: Return successful response
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
 * @route POST /api/chat
 * @description
 * Chatbot endpoint that retrieves real meal data from the PostgreSQL database
 * and uses it to generate concise, structured nutrition advice with Groq LLM.
 * @returns {Object} { success, modelUsed, reply }
 */
const LOCATION_MAP = {
    AsasPlace: "Asa’s Place",
    Iacocca: "Iacocca Cafe",
    "Nest@Night": "Nest @ Night",
    Hideaway: "Hideaway Cafe",
    SouthMountain: "South Mountain Grill",
    Kalamata: "Kalamata",
    TheTalon: "The Talon",
    LehighPub: "Lehigh Pub",
    HisshoSushi: "Hissho Sushi",
    MeinBowl: "Mein Bowl",
    LeafLadle: "Leaf & Ladle",
    PurplePita: "Purple Pita",
    FudTruck: "Fud Truck",
    CommonGrounds: "Common Grounds Cafe",
    TheGrind: "The Grind Cafe",
    TheHearth: "The Hearth"
};
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ success: false, error: 'Missing or invalid "message" field.' });
        }

        // Ensure Groq API key
        if (!process.env.GROQ_API_KEY) {
            return res.status(400).json({ success: false, error: 'Missing Groq API key.' });
        }

        // Import dependencies
        const { generateResponse } = require('./functions/chatbot_functions');
        const { Pool } = require('pg');

        // PostgreSQL connection
        const pool = new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            ssl: { rejectUnauthorized: false }
        });

        // Query: Fetch a subset of meals for context
        const result = await pool.query(`
            SELECT meal_name, location, price, calories, protein, fat, carbs, tags
            FROM meals
            WHERE calories IS NOT NULL
            ORDER BY RANDOM()
            LIMIT 15;
        `);

        const meals = result.rows;

        // Format meal data into readable text
        const mealContext = meals.map((m, i) => {
            const locationName = LOCATION_MAP[m.location] || m.location;  // Formatted location
            const tagLabel = m.tags ? ` (${m.tags})` : '';
            return `${i + 1}. ${m.meal_name} — ${locationName} — $${m.price || '?'} — `
                + `${m.calories} kcal, P:${m.protein}g C:${m.carbs}g F:${m.fat}g${tagLabel}`;
        }).join('\n');


        // Build message with database context
        const contextMessage = 
            `Meal data currently available from the Lehigh University dining database:\n${mealContext}\n\n` +
            `User question: ${message}\n` +
            `Use only the above meal data when answering.`;

        // Call LLM
        const reply = await generateResponse(contextMessage);

        res.json({
            success: true,
            modelUsed: process.env.LLM_MODEL || 'llama-3.1-8b-instant',
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
// 4. Serving Frontend Build and Starting Server
// ============================================================================================================

const path = require("path");

// Serve static frontend assets
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Serve React app for root and other non-API routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});