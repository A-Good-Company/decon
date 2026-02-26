// utils/iverse.js
import store from '@/utils/stores';
import { franc } from 'franc';

// Configuration from AidaWidget
const AGENT_PROD_HOST = 'https://aida-agentbackend-prod.graydune-dda4d1ba.canadaeast.azurecontainerapps.io';
const CHAT_URL = `${AGENT_PROD_HOST}/iverse_agent`;

const langMap = { eng: "en", fra: "fr", ara: "ar", hin: "hi", tgl: "tl", ukr: "uk", san: "sa", nya: "ny" };
const supportedLanguages = Object.values(langMap);

const iverseService = {
    async generateText(prompt, callback) {
        const { model } = store.state;
        
        // 1. Prepare User ID (Decon doesn't have auth, so we generate/store a random one)
        let userId = localStorage.getItem('decon_user_id');
        if (!userId) {
            userId = `decon-user-${Date.now()}`;
            localStorage.setItem('decon_user_id', userId);
        }

        // 2. Detect Language (Logic from Aida)
        const detectedLang = franc(prompt);
        const detectedLanguageCode = supportedLanguages.includes(langMap[detectedLang]) ? langMap[detectedLang] : "en";

        // 3. Construct Payload
        // Decon usually sends just the "prompt", but Iverse API expects "message_history".
        // We wrap the current prompt as the latest human message.
        const payload = {
            user_input: prompt,
            message_history: [
                { type: 'human', content: prompt }
            ],
            user_id: userId,
            email: 'decon-user@example.com', // Placeholder required by API
            page_path: '/decon',
            language: detectedLanguageCode,
            model: model, // e.g., 'deepseek/deepseek-r1'
        };

        try {
            const response = await fetch(CHAT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            
            // State to handle reasoning formatting
            let reasoningBuffer = '';
            let isResponseOpen = false;

            // eslint-disable-next-line no-constant-condition
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split('\n\n');
                buffer = parts.pop(); // Keep incomplete chunk

                for (const part of parts) {
                    if (part.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(part.substring(6));
                            
                            // Handle Reasoning (Thinking) - Format as blockquote for Decon
                            if (data.reasoning_content) {
                                reasoningBuffer += data.reasoning_content;
                                const lines = reasoningBuffer.split('\n');
                                const completeLines = lines.slice(0, -1);
                                reasoningBuffer = lines[lines.length - 1];

                                if (completeLines.length > 0) {
                                    const quotedLines = completeLines.map(line => `> ${line}`).join('\n');
                                    callback(quotedLines + '\n');
                                }
                            }

                            // Handle Main Content
                            if (data.delta_content) {
                                // Flush remaining reasoning if switching to content
                                if (reasoningBuffer) {
                                    const quotedLine = `> ${reasoningBuffer}`;
                                    callback(quotedLine + '\n\n');
                                    reasoningBuffer = '';
                                }
                                
                                if (!isResponseOpen) {
                                    isResponseOpen = true;
                                }
                                callback(data.delta_content);
                            }
                        } catch (e) {
                            console.error("Stream parse error:", e);
                        }
                    }
                }
            }
            
            // Flush any remaining reasoning at the very end
            if (reasoningBuffer) {
                const quotedLine = `> ${reasoningBuffer}`;
                callback(quotedLine + '\n\n');
            }

        } catch (error) {
            console.error("Iverse API Error:", error);
            throw error;
        }
    }
};

export default iverseService;