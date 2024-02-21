import { createStore } from 'vuex'
import store from 'store'

export default createStore({
  state: {
    openAIKey: store.get('openAIKey') || process.env.VUE_APP_OPENAI_DEFAULT_KEY,
    replicateKey: store.get('replicateKey') || process.env.VUE_APP_REPLICATE_DEFAULT_KEY,
    isOpenAICharity: store.get('isOpenAICharity') || true,
    isReplicateCharity: store.get('isReplicateCharity') || true,
    tokenCount: store.get('tokenCount') || 20,
    model: store.get('model') || 'gpt-4',
    whisperLanguage: store.get('whisperLanguage') || 'en'
  },
  mutations: {
    updateOpenAIKey(state, key) {
        if (key && key.trim() !== '') {

        store.set('isOpenAICharity', false)
        state.isOpenAICharity = false
        state.openAIKey = key
        store.set('openAIKey', key)
        } else {
        store.set('isOpenAICharity', true)
        state.isOpenAICharity = true
        state.openAIKey = process.env.VUE_APP_OPENAI_DEFAULT_KEY
        store.set('openAIKey', process.env.VUE_APP_OPENAI_DEFAULT_KEY)

        }
    },
    updateReplicateKey(state, key) {
        if (key && key.trim() !== '') {

        store.set('isReplicateCharity', false)
        state.isReplicateCharity = false
        state.replicateKey = key
        store.set('replicateKey', key)
        } else {
        store.set('isReplicateCharity', true)
        state.isReplicateCharity = true
        state.replicateKey = process.env.VUE_APP_REPLICATE_DEFAULT_KEY
        store.set('replicateKey', process.env.VUE_APP_REPLICATE_DEFAULT_KEY)

        }
    },
    updateTokenCount(state, count) {
      state.tokenCount = count
      store.set('tokenCount', count)
    },
    updateModel(state, model) {
      state.model = model
      store.set('model', model)
    },
    updateWhisperLanguage(state, whisperLanguage) {
      state.whisperLanguage = whisperLanguage
      store.set('whisperLanguage', whisperLanguage)
    },
  }
})