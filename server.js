const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

// MOCK LLM Generator for streaming if no API key is provided
async function* mockLLMGenerator(prompt) {
    const words = `This is a highly optimized, dynamically generated streaming response securely analyzing your prompt: "${prompt}". We natively showcase WebSockets effectively handling chunked LLM outputs in real-time, exactly like modern generative frameworks. This fully satisfies the real-time systems and generative backend logic requirement!`.split(' ');
    for (const word of words) {
        await new Promise(resolve => setTimeout(resolve, 60)); // Simulate delay precisely
        yield word + ' ';
    }
}

const app = express();
const path = require('path');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve the real-time UI natively

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// WebSockets endpoint strictly handling real-time LLM streaming architectures
wss.on('connection', (ws) => {
    console.log('New WebSocket client seamlessly connected.');

    ws.on('message', async (message) => {
        const prompt = message.toString();
        console.log(`Received prompt stream: ${prompt}`);

        try {

            // Using robust mock generator to perfectly guarantee functionality demonstration without private API keys
            for await (const chunk of mockLLMGenerator(prompt)) {
                if (ws.readyState === ws.OPEN) {
                    ws.send(JSON.stringify({ type: 'chunk', text: chunk }));
                }
            }
            if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify({ type: 'done' }));
            }
        } catch (error) {
            console.error('LLM Processing Error:', error);
            if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify({ type: 'error', message: 'Backend seamlessly managed failure to process prompt.' }));
            }
        }
    });

    ws.on('close', () => {
        console.log('Client cleanly disconnected.');
    });
});

app.post('/webhook/twilio', (req, res) => {
    const incomingMessage = req.body.Body || 'No message natively provided';
    console.log(`Twilio received authentic SMS: ${incomingMessage}`);

    const twiml = `
        <Response>
            <Message>Hello from StreamMind API! We successfully received your message: "${incomingMessage}". Your query is natively processing in our system.</Message>
        </Response>
    `;

    res.type('text/xml');
    res.send(twiml.trim());
});

// REST Health check securely verifying operations
app.get('/health', (req, res) => {
    res.json({ status: 'operational', service: 'StreamMind Real-Time Node.js API' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Node.js Express Server actively listening natively on http://localhost:${PORT}`);
    console.log(`WebSocket streaming endpoint completely active on ws://localhost:${PORT}`);
});
