import axios from 'axios';
import store from '@/utils/stores'

const errorMessage = "An error occurred while calling Replicate API, which our app uses for AI functions. The issue might be due to browser restrictions. To bypass this, we're using a proxy server. Please visit https://cors-anywhere.herokuapp.com to enable access. If it persists, fetching another Replicate key could also resolve the issue."

const POLLING_INTERVAL = 20000; // ms
const MAX_POLLING_ATTEMPTS = 20; // 

const MODEL_VERSIONS = {
    'replicate-wizard': {
        version: 'a4be2a7c75e51c53b22167d44de3333436f1aa9253a201d2619cf74286478599',
        streaming: false,
        inputParam: 'message'
    },
    'replicate-neuralbeagle': {
        version: '4c5eaa791be134c9711ea3a93e62f699540f733fd83c3a2d3df21be42dbdda25',
        streaming: true,
        inputParam: 'prompt'
    },
    'replicate-myneuralbeagle': {
        isDeployment: true, // New flag to indicate this is a deployment
        owner: 'a-good-company',
        model: 'decon',
        streaming: true,
        inputParam: 'prompt'
    }
};

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
        console.log('model selected:', store.state.model);
    
        const modelConfig = MODEL_VERSIONS[store.state.model];
        if (!modelConfig) {
            throw new Error('Invalid model selected');
        }
    
        console.log("Using model config:", modelConfig);
        
        // Create input object based on model's required parameter name
        const input = {
            [modelConfig.inputParam]: prompt,
            temperature: 0.1
        };
    
        // Prepare request data differently for deployments vs regular models
        const requestData = modelConfig.isDeployment ? {
            input: input,
            stream: modelConfig.streaming
        } : {
            version: modelConfig.version,
            input: input,
            stream: modelConfig.streaming
        };
    
        try {
            const predictionResponse = await this.makePredictionRequest(requestData);
            const prediction = predictionResponse.data;
            
            const readyPrediction = await this.waitForModelReady(prediction.id);
            
            if (readyPrediction.status === 'failed') {
                throw new Error('Prediction failed');
            }
    
            if (modelConfig.streaming && callback) {
                return this.handleStreaming(readyPrediction.urls.stream, callback);
            } else {
                const result = readyPrediction.output;
                if (callback) callback(result);
                return result;
            }
    
        } catch (error) {
            console.error('Error in generateText:', error);
            console.error('Error stack:', error.stack);
            alert(errorMessage);
            throw error;
        }
    },

    async makePredictionRequest(requestData) {
        console.log('Making prediction request to Replicate API...');
        
        const modelConfig = MODEL_VERSIONS[store.state.model];
        let url = 'https://cors-anywhere.herokuapp.com/https://api.replicate.com/v1/';
        
        // Adjust URL and request data based on whether it's a deployment or regular model
        if (modelConfig.isDeployment) {
            url += `deployments/${modelConfig.owner}/${modelConfig.model}/predictions`;
        } else {
            url += 'predictions';
        }
    
        return axios({
            method: 'post',
            url: url,
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
    
    
    async generateTextSync(prompt) {
        const modelConfig = MODEL_VERSIONS[store.state.model];
        const INITIAL_DELAY = 2000; // 2 seconds
        const MAX_DELAY = 16000;    // 16 seconds
        
        const input = {
            [modelConfig.inputParam]: prompt,
            temperature: 0.1
        };
    
        const data = {
            version: modelConfig.version,
            input: input
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
    
            let prediction = response.data;
            console.log('Initial prediction response:', JSON.stringify(prediction, null, 2));
            
            let attempts = 0;
            let currentDelay = INITIAL_DELAY;
    
            while (prediction.status !== 'succeeded' && 
                   prediction.status !== 'failed' && 
                   attempts < MAX_POLLING_ATTEMPTS) {
                
                const delayToUse = Math.min(currentDelay * Math.pow(2, attempts), MAX_DELAY);
                console.log(`Polling attempt ${attempts + 1}, waiting ${delayToUse/1000} seconds...`);
                
                await new Promise(resolve => setTimeout(resolve, delayToUse));
                
                const pollResponse = await axios.get(
                    `https://cors-anywhere.herokuapp.com/https://api.replicate.com/v1/predictions/${prediction.id}`,
                    {
                        headers: {
                            'Authorization': `Token ${store.state.replicateKey}`
                        }
                    }
                );
                
                prediction = pollResponse.data;
                console.log(`Poll ${attempts + 1} response:`, JSON.stringify(prediction, null, 2));
                console.log(`Current status: ${prediction.status}`);
                
                if (prediction.error) {
                    console.error('Error detected:', prediction.error);
                }
                
                attempts += 1;
            }
    
            if (prediction.status === 'succeeded') {
                console.log('Generation succeeded. Final output:', prediction.output);
                return prediction.output;
            } else if (prediction.status === 'failed') {
                console.error('Generation failed. Final state:', JSON.stringify(prediction, null, 2));
                throw new Error('Prediction failed');
            } else {
                console.error('Polling timed out. Final state:', JSON.stringify(prediction, null, 2));
                throw new Error('Polling timed out');
            }
    
        } catch (error) {
            console.error('Error in generateTextSync:', error);
            console.error('Error details:', error.response ? error.response.data : error.message);
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