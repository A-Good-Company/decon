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
    whisperLanguage: store.get('whisperLanguage') || 'en',
    pinnedItems: store.get('pinnedItems') || {},
    prompts: store.get('prompts') || {},
    enableLrcSubs: store.get('enableLrcSubs') || false,
    enableSrtSubs: store.get('enableSrtSubs') || false,

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
    addPinnedItem(state, item) {
      state.pinnedItems[item.id] = item;
      store.set('pinnedItems', state.pinnedItems);
    },
    removePinnedItem(state, id) {
      delete state.pinnedItems[id];
      store.set('pinnedItems', state.pinnedItems);
    },
    updatePinnedItem(state, updatedItem) {
      state.pinnedItems[updatedItem.id] = updatedItem;
      store.set('pinnedItems', state.pinnedItems);
    },
    addPrompt(state, item) {
      if (Object.keys(state.prompts).includes(item.id)) {
        throw new Error('Prompt with this id already exists.');
      } else {
        state.prompts[item.id] = item;
        store.set('prompts', state.prompts);
      }
    },
    removePrompt(state, id) {
      delete state.prompts[id];
      store.set('prompts', state.prompts);
    },
    updatePrompt(state, updatedItem) {
      state.prompts[updatedItem.id] = updatedItem;
      store.set('prompts', state.prompts);
    },
    updateEnableLrcSubs(state, enableLrcSubs) {
      state.enableLrcSubs = enableLrcSubs
      store.set('enableLrcSubs', enableLrcSubs)
    },
    updateEnableSrtSubs(state, enableSrtSubs) {
      state.enableSrtSubs = enableSrtSubs
      store.set('enableSrtSubs', enableSrtSubs)
    },
  }
})