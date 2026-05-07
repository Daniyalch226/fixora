import Storage from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-chat');
    const chatMessages = document.getElementById('chat-messages');

    const addMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const handleSend = async () => {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';

        // Typing effect
        const typingId = Date.now();
        const typingMsg = document.createElement('div');
        typingMsg.className = 'message ai-message';
        typingMsg.id = `typing-${typingId}`;
        typingMsg.textContent = 'Analyzing your financial data...';
        chatMessages.appendChild(typingMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await Storage.askAI(text);
            document.getElementById(`typing-${typingId}`).textContent = response;
        } catch (e) {
            document.getElementById(`typing-${typingId}`).textContent = "I'm having trouble connecting to the intelligence module.";
        }
    };

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // Theme loading
    const settings = Storage.getSettings();
    if (settings.theme === 'dark') {
        document.body.classList.add('dark-mode');
    }
});
