import openAiService from './openai';
import anthropicService from './anthropic';
import store from '@/utils/stores'


const ai = {
    generateText(prompt, callback) {
        const modelType = store.state.model;
        const lowerCaseModelType = modelType.toLowerCase(); 
        if (lowerCaseModelType.includes('gpt')) return openAiService.generateText(prompt, callback);
        if (lowerCaseModelType.includes('claude')) return anthropicService.generateText(prompt, callback);
        throw new Error(`Invalid model type: ${modelType}`);
    }
};

export default ai;