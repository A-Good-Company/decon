import axios from 'axios';
import store from '@/utils/stores'

const errorMessage = "An error occurred while calling Replicate API, which our app uses for AI functions. The issue might be due to browser restrictions. To bypass this, we're using a proxy server. Please visit https://cors-anywhere.herokuapp.com to enable access. If it persists, fetching another Replicate key could also resolve the issue."

const POLLING_INTERVAL = 20000; // ms
const MAX_POLLING_ATTEMPTS = 300; // s

const replicateService = {
    async submitReplicateSplitDemucs(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                const base64String = reader.result
                console.log("644 some value");
                const axios = require('axios');
                let data = JSON.stringify({
                    "version": "25a173108cff36ef9f80f854c162d01df9e6528be175794b81158fa03836d953",
                    "input": {
                        "audio": base64String,
                        "shifts": 1,
                        "float32": false,
                        "overlap": 0.25,
                        "clip_mode": "rescale",
                        "model_name": "htdemucs",
                        "mp3_bitrate": 128,
                        "output_format": "mp3"
                    }
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://cors-anywhere.herokuapp.com/https://api.replicate.com/v1/predictions',
                    headers: {
                        'Authorization': `token ${store.state.replicateKey}`,
                        'Content-Type': 'application/json'
                    },
                    data: data
                };

                try {
                    let response = await axios.request(config);
                    console.log("Response is here")
                    resolve(response.data.id);
                } catch (error) {
                    console.log(error);
                    alert(errorMessage);
                }
            };
        });
    },
    async submitReplicateSplit(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                const base64String = reader.result
                console.log("644 some value");
                const axios = require('axios');
                let data = JSON.stringify({
                    "version": "cd128044253523c86abfd743dea680c88559ad975ccd72378c8433f067ab5d0a",
                    "input": {
                        "audio": base64String
                    }
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://cors-anywhere.herokuapp.com/https://api.replicate.com/v1/predictions',
                    headers: {
                        'Authorization': `token ${store.state.replicateKey}`,
                        'Content-Type': 'application/json'
                    },
                    data: data
                };

                try {
                    let response = await axios.request(config);
                    console.log("Response is here")
                    resolve(response.data.id);
                } catch (error) {
                    console.log(error);
                    alert(errorMessage);

                }
            };
        });
    },
    
    
    async generateText(prompt, callback) {
        console.log('Starting generateText with prompt:', prompt);

        console.log('model selected:', store.state.model)

        const MODEL_VERSIONS = {
            'replicate-wizard': 'a4be2a7c75e51c53b22167d44de3333436f1aa9253a201d2619cf74286478599',
            'replicate-neuralbeagle': '4c5eaa791be134c9711ea3a93e62f699540f733fd83c3a2d3df21be42dbdda25'
            // Add more models as needed
        };

        const versionId = MODEL_VERSIONS[store.state.model];

        console.log("Hitting version:", versionId)
        
        const requestData = {
            version: versionId,
            input: {
                prompt: prompt,
                temperature: 0.1
            },
            stream: true
        };

        try {
            // Initial prediction request
            const predictionResponse = await this.makePredictionRequest(requestData);
            const prediction = predictionResponse.data;
            
            // Wait for model to be ready
            const readyPrediction = await this.waitForModelReady(prediction.id);
            
            if (readyPrediction.status === 'failed') {
                throw new Error('Prediction failed');
            }

            // Now that model is ready, start streaming
            return this.handleStreaming(readyPrediction.urls.stream, callback);

        } catch (error) {
            console.error('Error in generateText:', error);
            console.error('Error stack:', error.stack);
            alert(errorMessage);
            throw error;
        }
    },

    async makePredictionRequest(requestData) {
        console.log('Making prediction request to Replicate API...');
        return axios({
            method: 'post',
            url: 'https://cors-anywhere.herokuapp.com/https://api.replicate.com/v1/predictions',
            headers: {
                'Authorization': `Token ${store.state.replicateKey}`,
                'Content-Type': 'application/json'
            },
            data: requestData
        });
    },

    async waitForModelReady(predictionId) {
        console.log('Waiting for model to be ready...');
        let attempts = 0;

        while (attempts < MAX_POLLING_ATTEMPTS) {
            const response = await axios.get(
                `https://cors-anywhere.herokuapp.com/https://api.replicate.com/v1/predictions/${predictionId}`,
                {
                    headers: {
                        'Authorization': `Token ${store.state.replicateKey}`
                    }
                }
            );

            const prediction = response.data;
            console.log('Prediction status:', prediction.status);

            if (prediction.status === 'succeeded') {
                return prediction;
            }

            if (prediction.status === 'failed') {
                throw new Error('Prediction failed');
            }

            await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
            attempts += 1;
        }

        throw new Error('Model warming up timed out');
    },

    handleStreaming(streamUrl, callback) {
        console.log('Starting streaming from URL:', streamUrl);
        const source = new EventSource(streamUrl);

        source.onopen = (event) => {
            console.log('EventSource connection opened:', event);
        };

        source.addEventListener("output", (event) => {
            console.log('Received output event:', event);
            if (event.data && callback) {
                callback(event.data);
            }
        });

        source.addEventListener("done", (event) => {
            console.log('Received done event:', event);
            source.close();
        });

        source.onerror = (error) => {
            console.error('Stream error:', error);
            source.close();
            throw error;
        };

        return source;
    },
    
    
    // Add this method for non-streaming text generation
    async generateTextSync(prompt) {
        const data = {
            version: "4c5eaa791be134c9711ea3a93e62f699540f733fd83c3a2d3df21be42dbdda25",
            input: {
                prompt: prompt,
                temperature: 0.1
            }
        };
    
        try {
            const response = await axios({
                method: 'post',
                url: 'https://cors-anywhere.herokuapp.com/https://api.replicate.com/v1/predictions',
                headers: {
                    'Authorization': `Token ${store.state.replicateKey}`,
                    'Content-Type': 'application/json'
                },
                data: data
            });
    
            // Poll for completion
            let prediction = response.data;
            while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const pollResponse = await axios.get(
                    `https://cors-anywhere.herokuapp.com/https://api.replicate.com/v1/predictions/${prediction.id}`,
                    {
                        headers: {
                            'Authorization': `Token ${store.state.replicateKey}`
                        }
                    }
                );
                prediction = pollResponse.data;
            }
    
            if (prediction.status === 'succeeded') {
                return prediction.output;
            } else {
                throw new Error('Prediction failed');
            }
    
        } catch (error) {
            console.error('Error in generateTextSync:', error);
            alert(errorMessage);
            throw error;
        }
    },
    
    async checkStatus(id) {
        try {
            const response = await axios.get(
                `https://cors-anywhere.herokuapp.com/https://api.replicate.com/v1/predictions/${id}`, {
                headers: {
                    'Authorization': `token ${store.state.replicateKey}`
                }
            });
            const data = response.data;
            console.log(data);
            return data.status;
        } catch (error) {
            console.log(error);
            alert(errorMessage);
        }
    },
    async getOutput(id) {
        try {
            const response = await axios.get(
                `https://cors-anywhere.herokuapp.com/https://api.replicate.com/v1/predictions/${id}`, {
                headers: {
                    'Authorization': `token ${store.state.replicateKey}`
                }
            });
            const data = response.data;
            console.log(data.output);

            return data.output;
        } catch (error) {
            console.log(error);
            alert(errorMessage);
        }
    },
}

export default replicateService;