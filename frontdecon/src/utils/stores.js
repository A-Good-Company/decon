import { createStore } from 'vuex'
import store from 'store'


let defaultPinnedItems = {
  '1': {
    id: '1',
    header: 'Welcome to Decon',
    content: "Decon\n---\n\nEmbedded in the Buddhist principle that all things are ultimately empty, Decon is an open-source technological tool that draws on this fundamental understanding to dissect specifics and parse out knowledge. By breaking things apart, we gain a more profound understanding of their core functions, allowing us to improve and innovate further. \n\nHarnessing the formidable capabilities of AI, Decon is a browser-based application designed to delve deep into the essence of things. Powered by OpenAI's APIs for text and automatic speech recognition (ASR), Decon applies artificial intelligence to analyse, decipher, and interpret data. For the dissection of audio into its primary components, it utilizes the Replicate API, providing a holistic and comprehensive understanding of the constituent elements. \n\nWith Decon, the pursuit of knowledge isn't about accumulation but about reduction, bringing us one step closer to genuine understanding and ingenious discovery.\n\nHowever, with great power comes great responsibility. Through Decon, you are accessing one of the most potent tools humans have ever created. Therefore, we urge you to utilize this resource with care, respect, and good intentions, always striving for the betterment of all beings.\n\n#### Translation in Hinglish *(Try clicking Hallucinate)*:\n\n"
  },
};

let defaultPrompts = {
  'Summarize': {
    id: 'Summarize',
    content: "{{context}}\n\nDetailed summary in around 50 points, with all fine points captured: ",
  },
  'Decon Language': {
    id: 'Decon Language',
    content: "Prompt:\nExplain the sentence in fine details, with letters used if letters are non-english. Explain one word/phrase at a time. \n\nSampleInput:\nतेरी मेरी प्रेम कहानी, है सबसे प्यारी\n\nExplanation:\nतेरी/Teri - Yours (तेरी/Teri : yours) ; Letters used - त : Ta, र : Ra, ी : 'ee' matra\nमेरी/Meri - Mine (मेरी/Meri : mine) ; Letters used - म : Ma, र : Ra, ी : 'ee' matra\nप्रेम/Prem - Love (प्रेम/Prem: love); Letters used - प : Pa, र : Ra, े: 'e' matra, म: Ma\nकहानी/Kahani - Story (कहानी/Kahani: story); Letters used - क: Ka, हा: Ha with 'aa' matra, न: Na, ी: 'ee' matra\nहै/Hai - Is (है/Hai: is); Letters used - ह: Ha, ै: 'ai' matra\nसबसे/Sabse - The most/the best; Letters used - स: Sa, ब: Ba, से: Se\nप्यारी/Pyari - Lovely/dear; Letters used - प्या: Pa combined with ya with 'aa' matra, री: Ra with 'ee' matra\n\nFull Translation:\nYours and mine love story is the dearest of all.\n\nProbable Meaning:\nThe speaker is expressing that the love story between them and their partner is the most precious compared to others.\n\nSampleInput:\nرجعوني عنيه لأيام اللي راحوا علمونا اندم على الماضي وجراحوا\n\nExplanation:\nرجعوني/Rajeouni - Return me (رجع/rajea : return, و/ou : me) ; Letters used - ر : Ra, ج : Jim, ع : Ain, و : Waw, ن : Nun, ي : Ya\nعنيه/aineih - His eyes (عن/aen : about, يه/ih : him) ; Letters used - ع : Ain, ن : Nun, ي : Ya, ه : Ha\nلأيام/le ayam - To days (ل/le : to, أيام/ayam : days) ; Letters used - ل : Lam, أ : Alif, ي : Ya, ا : Ain, م : Mim\nاللي/elly - Which ; Letters used - ال : Alif Lam (the), ل : Lam, ي : Ya\nراحوا/rahoua - They went (راح/rhah : went, وا/wa : they) ; Letters used - ر : Ra, ا : Alif, ح : Ha, و : Waw, ا : Alif\nعلمونا/alamouna - They taught us (علم/alim : taught, ونا/wana : us) ; Letters used - ع : Ain, ل : Lam, م : Mim, و : Waw, ن : Nun, ا : Alif\nاندم /andam - Regret ; Letters used - ا : Alif, ن : Nun, د : Dal. م : Mim\nعلى /ala - On ; Letters used - ع : Ain, ل : Lam, ى : Ya\nالماضي/al madi - The Past (ال/al : the, ماضي/madi : past) ; Letters used - ال : Alif Lam (definite article), م : Mim, ا : Alif, ض : Dad, ي : Ya\nوجراحوا/wejrahoua - And their wounds (و/we : and, جراح/jirah : wounds, وا/wa : their) ; Letters used - و : Waw (and), ج : Jeem, ر : Ra, ا : Alif, ح : Ha, و : Waw, ا : Alif\n\nFull Translation:\nHis eyes return me to the days that have passed, they taught us to regret the past and its wounds.\n\nProbable Meaning:\nThe author is expressing a desire to return to their past, acknowledging that those experiences taught them to feel regret for the wounds and pain they endured.\n\n\nSampleInput:\nاللي شفته قبل ما تشوفك عينيا عمري ضايع يحسبوه ازاي عليا\n\nExplanation:\nاللي/elly - The one who (اللي/elly : the one who) ; Letters used - ال : Alif Lam (the), ل : Lam, ي : Ya\nشفته/shafth - I saw him (شفت/shaft : saw, ه/him : him) ; Letters used - ش : Sheen, ف : Fa, ت : Ta, ه : Ha\nقبل/qabl - Before ; Letters used - ق : Qaf, ب : Ba, ل : Lam\nما/ma - Not ; Letters used - م : Mim, ا : Alif\nتشوفك/tshoufak - You see (تشوف/tshouf : see, ك/k : you) ; Letters used - ت : Ta, ش : Sheen, و : Waw, ف : Fa, ك : Kaf\nعينيا/ainia - My eyes (عين/ain : eye, يا/yaa : my) ; Letters used - ع : Ain, ي : Ya, ن : Nun, ي : Ya\nعمري/'omri - My life (عمر/'omr : life, ي/yi : my) ; Letters used - ع : Ain, م : Mim, ر Ra, ي Ya\nضايع/daia' - Lost ; Letters used - ض : Daad, ا : Alif, ي : Ya', ع : Ain\nيحسبوه/yehsabuhu – They count it (يحسب/yehsab : count, ه/him : it ) ; Letters used - ي : Ya', و : Waw, ه : Ha\nازاي/ezay – How ; Letters used - ا : Alif, ز : Zayn, ا : Alif, ي : Ya'\nعليا/alaya – On me ; Letters used - ع : Ain, ل : Lam, ي : ya'\n\nFull Translation:\nThe one I saw before my eyes saw you, how can they count my lost life against me?\n\nProbable Meaning:\nThe author is reflecting on their life before they met their love, questioning why they should be held accountable for the time they feel was wasted before they found their love.\n\n---\n\n\nActual Input:\n{{context}}\n\nExplanation:"
  }
};


export default createStore({
  state: {
    openAIKey: store.get('openAIKey') || process.env.VUE_APP_OPENAI_DEFAULT_KEY,
    replicateKey: store.get('replicateKey') || process.env.VUE_APP_REPLICATE_DEFAULT_KEY,
    anthropicKey: process.env.VUE_APP_ANTHROPIC_DEFAULT_KEY,
    deepseekKey: store.get('deepseekKey') || process.env.VUE_APP_DEEPSEEK_DEFAULT_KEY,
    isOpenAICharity: store.get('isOpenAICharity') || true,
    isReplicateCharity: store.get('isReplicateCharity') || true,
    tokenCount: store.get('tokenCount') || 4000,
    model: store.get('model') || 'gpt-4o',
    whisperLanguage: store.get('whisperLanguage') || 'en',
    pinnedItems: store.get('pinnedItems') ?? defaultPinnedItems ,
    prompts: store.get('prompts') ?? defaultPrompts,
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
    updateAnthropicKey(state, key) {
      if (key && key.trim() !== '') {

        store.set('isAnthropicCharity', false)
        state.isAnthropicCharity = false
        state.anthropicKey = key
        store.set('anthropicKey', key)
      } else {
        store.set('isAnthropicCharity', true)
        state.isAnthropicCharity = true
        state.anthropicKey = process.env.VUE_APP_ANTHROPIC_DEFAULT_KEY
        store.set('anthropicKey', process.env.VUE_APP_ANTHROPIC_DEFAULT_KEY)

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
      if (!Object.keys(state.prompts).includes(item.id)) {
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
    updateDeepseekKey(state, key) {
      if (key && key.trim() !== '') {
          state.deepseekKey = key;
          store.set('deepseekKey', key);
      } else {
          state.deepseekKey = process.env.VUE_APP_DEEPSEEK_DEFAULT_KEY;
          store.set('deepseekKey', process.env.VUE_APP_DEEPSEEK_DEFAULT_KEY);
      }
  }
  }
})