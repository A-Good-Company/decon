import openAiService from './openai';
import anthropicService from './anthropic';
import replicateService from './replicate';
import deepseekService from './deepseek';
import iverseService from './iverse'; // Import the new service
import store from '@/utils/stores'

const ai = {
    generateText(prompt, callback) {
        const modelType = store.state.model;
        const lowerCaseModelType = modelType.toLowerCase();

        // Check for Iverse/Agent specific models first
        // You can adjust this condition based on what you name the models in store.js
        if (lowerCaseModelType.includes('iverse') || lowerCaseModelType.includes('deepseek/')) {
            return iverseService.generateText(prompt, callback);
        }

        if (lowerCaseModelType.includes('gpt')) return openAiService.generateText(prompt, callback);
        if (lowerCaseModelType.includes('claude')) return anthropicService.generateText(prompt, callback);
        if (lowerCaseModelType.includes('replicate')) {
            return replicateService.generateText(prompt, callback);
        }
        // Fallback for direct deepseek key usage if not using the iverse prefix
        if (lowerCaseModelType.includes('deepseek')) {
            return deepseekService.generateText(prompt, callback);
        }
        
        throw new Error(`Invalid model type: ${modelType}`);
    }
};

export default ai;