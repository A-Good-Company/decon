import store from '@/utils/stores'

const exampleMessages = [
    { role: "user", content: "Complete the content: Paris is" },
    { role: "assistant", content: "known as the 'City of Light', celebrated for its art, fashion, and history. It is famous for landmarks such as the Eiffel Tower and rich cultural tapestry dating back to its founding in the 3rd century BC." },
    { role: "user", content: "Complete the content: Here's a short poem on Open Source:\n\nOpen Source, a realm o"},
    { role: "assistant", content: "f shared creation,\nWhere code flows free without hesitation.\nDevelopers unite from every nation,\nTo build and innovate with collaboration."}
];

const anthropicService = {
    async generateText(prompt, callback) {
        const max_tokens = parseInt(store.state.tokenCount);
        const model = store.state.model;
        const key = store.state.anthropicKey;
        const system=`You are an advanced AI assistant, specialized in text and code completion. Your primary function is to intelligently and creatively finish partial texts, sentences, code snippets, or prompts provided by the user. Your completions should be contextually relevant, coherent, and natural-sounding for text, or syntactically correct and logically consistent for code.

You can handle a wide range of topics and styles, from factual information and creative writing to various programming languages and markup formats. Always aim to provide detailed, engaging, and accurate completions that seamlessly continue from the given starting point.

For text completion, adapt your tone and style to match the context of the input. For code completion, consider the programming language, common coding practices, and potential functionality.

Your completions should:
1. Be relevant to the given context
2. Maintain consistency in style and tone
3. Provide meaningful and logical continuations
4. Avoid unnecessary repetition of the initial prompt
5. Offer creative solutions where appropriate
6. Follow proper syntax and conventions for code snippets

Whether it's finishing a story, completing a technical document, or suggesting the next lines of code, strive to deliver high-quality, useful, and contextually appropriate completions.`
        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access' : true
        };
        const body = JSON.stringify({ model, max_tokens, system, stream: true, messages: [...exampleMessages, { role: "user", content: "Complete the content: " + prompt }] });

        const response = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers, body });

        if (!response.ok) {

            if (response.type == 'cors' && response.status == '403') {
                alert("CORS Error")
            } else {
                const errorBody = await response.json();
                const errorMsg = errorBody.error?.message || `Error: ${response.status} ${response.statusText}`;
                throw new Error(errorMsg);
            }
        }

        const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();
        if (!reader) return;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const { value, done } = await reader.read();
            if (done || value?.includes('event: message_stop')) break;

            const data = value?.split('\n').filter(line => line.startsWith('data: ')).map(line => line.substring(6).trim());

            // Only take 'data: ' lines corresponding to event: content_block_delta
            if (value?.includes('event: content_block_delta')) {
                data.forEach((dataLine) => {
                    try {
                        const parsedData = JSON.parse(dataLine);
                        const chunkContent = parsedData?.delta?.text;
                        if (chunkContent && callback) callback(chunkContent);
                    } catch (error) {
                        console.error("Error parsing data:", error);
                    }
                });
            }
        }



    }
};

export default anthropicService;