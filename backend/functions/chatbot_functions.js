// ============================================================================================================
//  Chatbot Functions (Groq API Integration with Fallback Models)
// ============================================================================================================

/**
 * @description
 * Handles all chatbot-related functionality for NourishLU.
 * This module sends text-generation requests to the Groq API
 * and includes a fallback system that automatically retries
 * with alternative models if one becomes unavailable.
 */

// --------------- Environment and Dependencies ---------------
require('dotenv').config();  //  Loads environment variables from the .env file


// --------------- Configuration Variables ---------------
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';  //  Groq’s OpenAI-compatible chat endpoint
const DEFAULT_MODEL = process.env.LLM_MODEL || 'llama-3.1-8b-instant';  //  Default model used for responses
const API_KEY = process.env.GROQ_API_KEY;  //  Groq API key stored in .env

//  Fallback models in case the primary model is deprecated or unavailable
const FALLBACK_MODELS = [
    'llama-3.1-70b-versatile',
    'mixtral-8x7b',
    'gemma2-9b-it'
];




// ============================================================================================================
//  Generate Chatbot Response (with Optional Model Parameter)
// ============================================================================================================

/**
 * @function generateResponse
 * Sends a user message to the Groq API and retrieves the model’s generated response.
 * If a specific model is passed in, it uses that model; otherwise defaults to .env configuration.
 * @param {string} message  The text sent from the frontend user.
 * @param {string} [modelOverride]  Optional model name to override the default.
 * @returns {Promise<string>}  The generated model reply or a fallback message.
 */
async function generateResponse(message, modelOverride) {

    //  Determine which model to use for this specific request
    const activeModel = modelOverride || DEFAULT_MODEL;

    //  Helper function that sends a single API request to Groq
    async function sendRequest(modelName) {
        const response = await fetch(GROQ_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,  //  Authenticates the API request
                'Content-Type': 'application/json'  //  Defines JSON payload type
            },
            body: JSON.stringify({
                model: modelName,  //  Model used for text generation
                messages: [
                    { role: 'system', content: 'You are a concise, friendly assistant for Lehigh University students. Provide short, actionable nutrition and campus dining advice.' },
                    { role: 'user', content: message }
                ],
                temperature: 0.7,  //  Adds controlled randomness for natural responses
                max_tokens: 256  //  Limits output length
            })
        });

        return await response.json();
    }

    //  Attempt with the provided or default model
    let data = await sendRequest(activeModel);

    //  Check if model was deprecated or unavailable
    if (data?.error?.code === 'model_decommissioned' || data?.error?.message?.includes('decommissioned')) {
        console.warn(`Primary model "${activeModel}" is deprecated. Attempting fallback models.`);

        //  Iterate through fallback models until one succeeds
        for (const fallback of FALLBACK_MODELS) {
            console.log(`Trying fallback model: ${fallback}`);
            data = await sendRequest(fallback);

            if (!data.error) {
                console.log(`Fallback model "${fallback}" succeeded.`);
                break;
            }
        }
    }

    //  Log final API response for debugging
    console.log('Groq API response:', JSON.stringify(data, null, 2));

    //  Extract and return generated text or fallback message
    return data.choices?.[0]?.message?.content?.trim() || '(no response)';
}




// ============================================================================================================
//  Export Functions
// ============================================================================================================

module.exports = { generateResponse };