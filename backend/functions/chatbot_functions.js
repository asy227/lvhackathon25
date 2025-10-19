// ============================================================================================================
//  Chatbot Functions (Groq API Integration with Context + Fallback Models)
// ============================================================================================================

/**
 * @description
 * Handles all chatbot-related functionality for NourishLU.
 * Adds contextual grounding to reduce hallucinations, while respecting Groq’s rate limits.
 * Automatically retries with fallback models when the primary is unavailable.
 */

// --------------- Environment and Dependencies ---------------
require('dotenv').config();  //  Loads environment variables from the .env file

// --------------- Configuration Variables ---------------
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = process.env.LLM_MODEL || 'llama-3.1-8b-instant';
const API_KEY = process.env.GROQ_API_KEY;

//  Fallback models (for decommissioned or rate-limited models)
const FALLBACK_MODELS = [
    'llama-3.1-70b-versatile',
    'mixtral-8x7b',
    'gemma2-9b-it'
];

// --------------- Groq Rate Limit Notes ---------------
/**
 * llama-3.1-8b-instant → ~30 requests/minute | ~500k tokens/day
 * Stay below 1 request every 2 seconds in production.
 * Keep temperature and token count moderate to avoid quota waste.
 */


// ============================================================================================================
//  Generate Chatbot Response (with Context + Optional Model Override)
// ============================================================================================================

/**
 * @function generateResponse
 * Sends a user message to the Groq API and retrieves a context-aware, concise response.
 * @param {string} message  User message from the frontend.
 * @param {string} [modelOverride]  Optional override for model name.
 * @returns {Promise<string>}  Model-generated reply.
 */
async function generateResponse(message, modelOverride) {
    const activeModel = modelOverride || DEFAULT_MODEL;

    async function sendRequest(modelName) {
        const response = await fetch(GROQ_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelName,
                messages: [
                    {
                        role: 'system',
                        content:
                            "You are NourishLU — a friendly, knowledgeable campus dining assistant for Lehigh University.\n" +
                            "You have access to real meal data from the database, including names, locations, prices, and nutrition info.\n" +
                            "When responding:\n" +
                            "• Mention only meals that appear in the provided data.\n" +
                            "• Give 2–3 meal suggestions that fit the user's question.\n" +
                            "• Use short, conversational sentences — not lists or headers.\n" +
                            "• Include quick details (location, calories, or protein) naturally inside sentences.\n" +
                            "• End your response by asking a short follow-up question to clarify their preferences.\n" +
                            "Example style:\n" +
                            "\"You might like the chicken ranch sandwich at CommonGrounds (74g protein) or the veggie wrap at The Grind (320 kcal). " +
                            "Would you like me to focus on lighter meals or higher-protein options next?\"\n" +
                            "Keep replies under 100 words and avoid bullet points or sections."
                    },
                    { role: 'user', content: message }
                ],
                temperature: 0.5,     //  Lowered for factual consistency
                max_tokens: 300       //  Conservative to stay well within rate limits
            })
        });
        return await response.json();
    }

    let data = await sendRequest(activeModel);

    if (data?.error?.code === 'model_decommissioned' || data?.error?.message?.includes('decommissioned')) {
        console.warn(`Primary model "${activeModel}" unavailable. Trying fallback models.`);
        for (const fallback of FALLBACK_MODELS) {
            console.log(`Trying fallback model: ${fallback}`);
            data = await sendRequest(fallback);
            if (!data.error) {
                console.log(`Fallback model "${fallback}" succeeded.`);
                break;
            }
        }
    }

    console.log('Groq API response:', JSON.stringify(data, null, 2));
    return data.choices?.[0]?.message?.content?.trim() || '(no response)';
}


// ============================================================================================================
//  Export Functions
// ============================================================================================================
module.exports = { generateResponse };