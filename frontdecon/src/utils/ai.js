import openAiService from './openai';
import anthropicService from './anthropic';
import replicateService from './replicate';
import deepseekService from './deepseek';
import store from '@/utils/stores'


const ai = {
    generateText(prompt, callback) {
        const modelType = store.state.model;
        const lowerCaseModelType = modelType.toLowerCase();
        if (lowerCaseModelType.includes('gpt')) return openAiService.generateText(prompt, callback);
        if (lowerCaseModelType.includes('claude')) return anthropicService.generateText(prompt, callback);
        if (lowerCaseModelType.includes('replicate')) {
            return replicateService.generateText(prompt, callback);
        }

        if (lowerCaseModelType.includes('deepseek')) {
            return deepseekService.generateText(prompt, callback);
        }
        throw new Error(`Invalid model type: ${modelType}`);
    }
};

export default ai;