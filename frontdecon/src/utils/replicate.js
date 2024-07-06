import axios from 'axios';
import store from '@/utils/stores'

const errorMessage = "An error occurred while calling Replicate API, which our app uses for AI functions. The issue might be due to browser restrictions. To bypass this, we're using a proxy server. Please visit https://cors-anywhere.herokuapp.com to enable access. If it persists, fetching another Replicate key could also resolve the issue."

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