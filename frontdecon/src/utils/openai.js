import axios from 'axios';
import store from '@/utils/stores'
import FormData from 'form-data';
import { format, fromUnixTime } from 'date-fns';

const openAiService = {
    async generateText(prompt) {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: store.state.model, 
            max_tokens: parseInt(store.state.tokenCount),
            messages: [{ role: "assistant", content: prompt }]
        }, {
            headers: {
                'Authorization': `Bearer ${store.state.openAIKey}`,
                'Content-Type': 'application/json'
            }
        });
        // Assuming that response data structure is similar to what's shown in the reference
        return response.data.choices[0].message.content; // Or handle response as needed
    },
    async generateChat(messages) {
        const formattedMessages = messages.map(message => ({ role: "user", content: message }));
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: store.state.model,
            max_tokens: parseInt(store.state.tokenCount),
            messages: formattedMessages
        }, {
            headers: {
                'Authorization': `Bearer ${store.state.openAIKey}`,
                'Content-Type': 'application/json'
            }
        });
        // Assuming that response data structure is similar to what's shown in the reference
        return response.data.choices[0].message.content; // Or handle response as needed
    },
    async queryImage(imageBlob, text) {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o',
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: text
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `${imageBlob}`
                    }
                  }
                ]
              }
            ],
            max_tokens: parseInt(store.state.tokenCount),
        }, {
            headers: {
                'Authorization': `Bearer ${store.state.openAIKey}`,
                'Content-Type': 'application/json'
            }
        });
        // Assuming that response data structure is similar to what's shown in the reference
        return response.data.choices[0].message.content; // Or handle response as needed
    },
    // Create common headers function
    createHeaders() {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${store.state.openAIKey}`);
        return headers;
    },

    createForm(data, prompt=''){
        const formdata = new FormData();
        formdata.append("model", "whisper-1");
        formdata.append("timestamp_granularities[]", "segment");
        formdata.append("response_format", "verbose_json")
        formdata.append("language", store.state.whisperLanguage)
        formdata.append("file", data);
        formdata.append("prompt", prompt); // add prompt to your form
        return formdata
    },

    // Create common post request function
    async postRequest(url, requestOptions){
        try {
            const response = await fetch(url, requestOptions);
            const result = await response.text();
            
            if (!response.ok) {
                throw new Error(`${response.status}: ${response.statusText}`);
            }
            return this.jsonToSubs(JSON.parse(result));
        } catch (error) {
            console.error('Error detecting text: ', error);
            throw error;
        }
    },

    // Detect text from file
    detectText(file, prompt='') {
        const requestOptions = {
            method: "POST",
            headers: this.createHeaders(),
            body: this.createForm(file, prompt),
            redirect: "follow",
        };
        return this.postRequest("https://api.openai.com/v1/audio/transcriptions", requestOptions)
    },
    // Detect text from audio blob
    detectTextFromAudioBlob(audioBlob, prompt='') {
        const requestOptions = {
            method: "POST",
            headers: this.createHeaders(),
            body: this.createForm(audioBlob, prompt), // pass prompt to createForm
            redirect: "follow",
        }; 
        return this.postRequest("https://api.openai.com/v1/audio/transcriptions", requestOptions)
    },

    jsonToSubs(json) {
        const substext = json.text;
        let srt = '';
        let lrc = '';

        json.segments.forEach((segment, i) => {
            // Construct timestamps
            const start = new Date(segment.start * 1000).toISOString().substr(11, 12);
            const end = new Date(segment.end * 1000).toISOString().substr(11, 12);
            let start_mins = format(fromUnixTime(segment.start), 'mm');
            let start_secs = format(fromUnixTime(segment.start), 'ss.SS');
            const start_lrc = `[${start_mins}:${start_secs}]`
  
            // Construct SRT and LRC text
            srt += `${i + 1}\n${start} --> ${end}\n${segment.text.replace(/[\u{1F600}-\u{1F64F}]/gu, "")}\n\n`;
            lrc += `${start_lrc}${segment.text.replace(/[\u{1F600}-\u{1F64F}]/gu, "")}\n`;
        });

        // Return SRT and LRC
        return { srt, lrc, text: substext };
    },
};

export default openAiService;