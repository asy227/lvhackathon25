require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");


// app.get('/', (req, res) => {
//     res.send('<h1>Hello, Geeks!</h1><p>This is your simple Express server.</p>');
// });

// app.listen(PORT, () => {
//     console.log(`Server is listening at http://localhost:${PORT}`);
// });

// Initialize Bedrock client
const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        // Build prompt with conversation history
        let prompt = conversationHistory
            .map(msg => `\n\n\${msg.role === 'user' ? 'Human' : 'Assistant'}: \${msg.content}`)
            .join('');
        
        prompt += `\n\nHuman: \${message}\n\nAssistant:`;

        // Prepare request for Claude
        const input = {
            modelId: 'anthropic.claude-v2', // or 'anthropic.claude-3-sonnet-20240229-v1:0'
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify({
                prompt: prompt,
                max_tokens_to_sample: 2000,
                temperature: 0.7,
                top_p: 0.9,
            })
        };

        // Call Bedrock
        const command = new InvokeModelCommand(input);
        const response = await bedrockClient.send(command);

        // Parse response
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const assistantMessage = responseBody.completion;

        res.json({
            success: true,
            message: assistantMessage,
            model: input.modelId
        });

    } catch (error) {
        console.error('Bedrock Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'bedrock-chatbot' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:\\${PORT}`);
});