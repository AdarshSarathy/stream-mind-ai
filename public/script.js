const chatBox = document.getElementById('chat-box');
const inputField = document.getElementById('prompt-input');
const sendBtn = document.getElementById('send-btn');

let ws;
let currentAiMessageDiv = null;

function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'chunk') {
            if (!currentAiMessageDiv) {
                currentAiMessageDiv = appendMessage('', 'ai-msg');
            }
            currentAiMessageDiv.textContent += data.text;
            chatBox.scrollTop = chatBox.scrollHeight;
        } else if (data.type === 'done') {
            currentAiMessageDiv = null;
        } else if (data.type === 'error') {
            appendMessage(data.message, 'system-msg');
            currentAiMessageDiv = null;
        }
    };

    ws.onclose = () => {
        appendMessage('Connection seamlessly lost. Reconnecting...', 'system-msg');
        setTimeout(connectWebSocket, 3000); // Robust native auto-reconnect functionality
    };
}

function appendMessage(text, className) {
    const div = document.createElement('div');
    div.className = `message ${className}`;
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    return div;
}

function sendMessage() {
    const text = inputField.value.trim();
    if (!text || !ws || ws.readyState !== WebSocket.OPEN) return;

    appendMessage(text, 'user-msg');
    ws.send(text);
    inputField.value = '';
    currentAiMessageDiv = null;
}

sendBtn.addEventListener('click', sendMessage);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Initialize real-time bridge securely
connectWebSocket();
