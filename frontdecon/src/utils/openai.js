import axios from 'axios';
import store from '@/utils/stores'
import FormData from 'form-data';
import { format, fromUnixTime } from 'date-fns';


const openAiService = {
    async generateText(prompt) {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: store.state.model, // Use the updated model from the reference
            max_tokens: parseInt(store.state.tokenCount),
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
    },

    async detectText(file) {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${store.state.openAIKey}`);

            const formdata = new FormData();
            formdata.append("model", "whisper-1");
            formdata.append("timestamp_granularities[]", "segment");
            formdata.append("response_format", "verbose_json")
            formdata.append("language", store.state.whisperLanguage)
            formdata.append("file", file);

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
            return this.jsonToSubs(result); // return the result instead of logging it to console

        } catch (error) {
            console.error('Error detecting text: ', error);
            throw error;
        }
    },

    jsonToSubs(jsonString) {
        const json = JSON.parse(jsonString);
        const substext = json.text;
        let srt = '';
        let lrc = '';
        for (let i = 0; i < json.segments.length; i++) {
            const segment = json.segments[i];

            // Construct SRT timestamp
            const start = new Date(segment.start * 1000).toISOString().substr(11, 12);
            const end = new Date(segment.end * 1000).toISOString().substr(11, 12);

            // Construct LRC timestamp with date-fns
            let start_mins = format(fromUnixTime(segment.start), 'mm');
            let start_secs = format(fromUnixTime(segment.start), 'ss.SS');
            const start_lrc = `[${start_mins}:${start_secs}]`

            // Construct SRT text and LRC text
            srt += `${i + 1}\n${start} --> ${end}\n${segment.text.replace(/[\u{1F600}-\u{1F64F}]/gu, "")}\n\n`;
            lrc += `${start_lrc}${segment.text.replace(/[\u{1F600}-\u{1F64F}]/gu, "")}\n`;
        }

        // Return SRT and LRC
        return { srt, lrc, text: substext };
    },
};

export default openAiService;