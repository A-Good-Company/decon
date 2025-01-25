import axios from 'axios';
import store from '@/utils/stores';

const DEEPSEEK_API_BASE = 'https://api.deepseek.com/v1';

const deepseekService = {
    async generateText(prompt, callback) {
        const { deepseekKey: key, model, tokenCount: max_tokens } = store.state;
        const headers = { 
            'Authorization': `Bearer ${key}`, 
            'Content-Type': 'application/json'
        };
        
        const body = JSON.stringify({ 
            model, 
            max_tokens: parseInt(max_tokens), 
            messages: [{ role: "user", content: prompt }],
            stream: true,
            temperature: 0.7 // You can adjust this or make it configurable
        });

        const response = await fetch(`${DEEPSEEK_API_BASE}/chat/completions`, {
            method: 'POST',
            headers,
            body
        });

        if (!response.ok) {
            const errorBody = await response.json();
            const errorMsg = errorBody.error?.message || `Error: ${response.status} ${response.statusText}`;
            throw new Error(errorMsg);
        }

        const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();
        if (!reader) return;

        let isDone = false;
        while (!isDone) {
            const { value, done } = await reader.read();
            isDone = done || value === 'data: [DONE]';
            if (!isDone) {
                value.split('\n')
                    .filter(data => data.length > 0 && !data.startsWith(':'))
                    .forEach((data) => {
                        try {
                            const chunkContent = JSON.parse(data.substring(6))?.choices?.[0]?.delta?.content;
                            if (chunkContent && callback) callback(chunkContent);
                        } catch (error) {
                            console.error("Error parsing data:", error);
                        }
                    });
            }
        }
    },

    async generateChat(messages) {
        const formattedMessages = messages.map(message => ({
            role: "user",
            content: message
        }));

        const response = await axios.post(`${DEEPSEEK_API_BASE}/chat/completions`, {
            model: store.state.model,
            max_tokens: parseInt(store.state.tokenCount),
            messages: formattedMessages,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${store.state.deepseekKey}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    },

    createHeaders() {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${store.state.deepseekKey}`);
        return headers;
    },
};

export default deepseekService;