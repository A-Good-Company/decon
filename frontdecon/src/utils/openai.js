import axios from 'axios';
import store from '@/utils/stores'
import FormData from 'form-data';

const openAiService = {
    async generateText(prompt) {
        console.log(`Bearer ${store.state.openAIKey}`)
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: store.state.model, // Use the updated model from the reference
                max_tokens: store.state.tokenCount,
                messages: [{ role: "user", content: prompt }]
                // You might want to include additional parameters if needed
            }, {
                headers: {
                    'Authorization': `Bearer ${store.state.openAIKey}`,
                    'Content-Type': 'application/json'
                }
            });
            // Assuming that response data structure is similar to what's shown in the reference
            return response.data.choices[0].message.content; // Or handle response as needed
        } catch (error) {
            console.error('Error generating text: ', error);
            throw error;
        }
    },

    async detectText(file) {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${store.state.openAIKey}`);

            const formdata = new FormData();
            formdata.append("model", "whisper-1");
            formdata.append("timestamp_granularities[]", "segment");
            formdata.append("response_format", "verbose_json")
            formdata.append("file", file);
            formdata.append("langugage", store.state.whisperLanguage)

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formdata,
                redirect: "follow",
            };

            const response = await fetch(
                "https://api.openai.com/v1/audio/transcriptions",
                requestOptions
            );
            const result = await response.text();
            return this.jsonToSrt(result); // return the result instead of logging it to console

        } catch (error) {
            console.error('Error detecting text: ', error);
            throw error;
        }
    },

    jsonToSrt(jsonString) {
        const json = JSON.parse(jsonString);
        console.log("json" + json);
        const substext = json.text;
        let srt = '';
        for (let i = 0; i < json.segments.length; i++) {
            const segment = json.segments[i];

            // Construct SRT timestamp
            const start = new Date(segment.start * 1000).toISOString().substr(11, 12);
            const end = new Date(segment.end * 1000).toISOString().substr(11, 12);

            // Construct SRT text

            // Add to SRT string
            srt += `${i + 1}\n${start} --> ${end}\n${segment.text}\n\n`;
        }

        // Return SRT
        return { srt, text: substext };
    },
};

export default openAiService;