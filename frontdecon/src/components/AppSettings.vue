<template>
    <div class="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-opacity-50 bg-black z-50">

        <div id="modal" title="Settings" class="w-full max-w-lg bg-white p-8 rounded">
            <form class="flex flex-wrap -mx-3 mb-6">
                <h3 class="w-full px-3 uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Settings
                </h3>

                <div class="w-full px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-s font-bold mb-2" for="openAIKey">
                        Open AI Key
                    </label>
                    <input type="text" v-model="openAIKey" id="openAIKey" placeholder="OpenAI Key"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                </div>

                <div v-if="isOpenAICharity" class="w-full px-3 mb-6 md:mb-0">
                    <p class="text-orange-500 text-s italic">Please note, this notebook runs on limited funds. If
                        possible, consider getting your own <a class="underline"
                            href="https://platform.openai.com/api-keys" target="_blank">OpenAI API key</a> to help keep
                        this resource free for those in need. Thanks.</p>
                </div>

                <div class="w-full px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-s font-bold mb-2"
                        for="tokenCount">Token Count (below 1000) :</label>
                    <input type="number" v-model="tokenCount" id="tokenCount" placeholder="Token Count" step="50"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                </div>

                <div class="w-full px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-s font-bold mb-2" for="model">
                        Please select a Model
                    </label>
                    <div class="relative">
                        <select v-model="model"
                            class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="model">
                            <option disabled value="">Please select a Model</option>
                            <option>gpt-4</option>
                            <option>gpt-3.5-turbo-16k-0613</option>
                        </select>
                    </div>
                </div>
                <div class="w-full px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-s font-bold mb-2" for="replicateKey">
                        Replicate Key
                    </label>
                    <input type="text" v-model="replicateKey" id="replicateKey" placeholder="Replicate Key"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                </div>

                <div v-if="isReplicateCharity" class="w-full px-3 mb-6 md:mb-0">
                    <p class="text-orange-500 text-s italic">Please note, this notebook runs on limited funds. If
                        possible, consider getting your own <a class="underline"
                            href="https://replicate.com/account/api-tokens" target="_blank">Replicate key</a> to help
                        keep this resource free for those in need. Thanks.</p>
                </div>

                <div class="w-full px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-s font-bold mb-2" for="model">
                        Select Audio detection language
                    </label>
                    <div class="relative">
                        <select v-model="selectedLanguage"
                            class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="asrlanguage">
                            <option disabled value="">Select Language</option>
                            <option v-for="language in languages" :value="language.code" :key="language.code">{{
                        language.name }}</option>

                        </select>
                    </div>
                </div>

                <div class="w-full px-3 mb-6 md:mb-0 flex items-center">
                    <input id="enableLrcSubs" type="checkbox" v-model="enableLrcSubs" class="mr-2">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        for="enableLrcSubs">
                        Enable LRC Subtitles
                    </label>
                </div>
                <div class="w-full px-3 mb-6 md:mb-0 flex items-center">
                    <input id="enableSrtSubs" type="checkbox" v-model="enableSrtSubs" class="mr-2">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        for="enableSrtSubs">
                        Enable SRT Subtitles
                    </label>
                </div>

                <div class="flex flex-row w-full px-3 md:mb-0 justify-end">
                    <themed-button type="close" @click="closeModal">Close</themed-button>
                    <themed-button type="default" @click="apply">Apply</themed-button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import ThemedButton from './items/ThemedButton.vue';

export default {
    components: {
        'themed-button': ThemedButton,
    },
    data() {
        return {
            openAIKey: '',
            replicateKey: '',
            tokenCount: '',
            model: '',
            selectedLanguage: '',
            languages: [
                { name: 'English', code: 'en' },
                { name: 'Hindi', code: 'hi' },
                { name: 'Spanish', code: 'es' },
                // add all the languages you support
            ],
            enableLrcSubs: false,
            enableSrtSubs: false,
        }
    },
    computed: {
        ...mapState([
            'openAIKey',
            'replicateKey',
            'tokenCount',
            'model',
            'isOpenAICharity',
            'isReplicateCharity',
            'whisperLanguage',
            'enableLrcSubs',
            'enableSrtSubs'
        ])
    },
    methods: {
        ...mapMutations([
            'updateOpenAIKey',
            'updateReplicateKey',
            'updateTokenCount',
            'updateModel',
            'updateWhisperLanguage',
            'updateEnableLrcSubs',
            'updateEnableSrtSubs'
        ]),
        apply() {
            const selectedLanguage = this.languages.find(
                language => language.code === this.selectedLanguage
            );
            this.updateWhisperLanguage(selectedLanguage ? selectedLanguage.code : null);

            if (this.openAIKey.trim() !== '') {
                this.updateOpenAIKey(this.openAIKey);
            } else {
                this.updateOpenAIKey(null);
            }
            this.updateTokenCount(this.tokenCount);
            this.updateModel(this.model);
            this.closeModal();

            this.updateEnableLrcSubs(this.enableLrcSubs);
            this.updateEnableSrtSubs(this.enableSrtSubs);
        },
        closeModal() {
            this.$emit("closeModal");
        }
    },
    created() {
        this.openAIKey = this.isOpenAICharity ? '' : this.$store.state.openAIKey;
        this.replicateKey = this.isReplicateCharity ? '' : this.$store.state.replicateKey;
        this.tokenCount = this.$store.state.tokenCount;
        this.model = this.$store.state.model;
        const currentLanguage = this.languages.find(
            language => language.code === this.$store.state.whisperLanguage
        );

        this.selectedLanguage = currentLanguage ? currentLanguage.code : "";
        this.enableLrcSubs = this.$store.state.enableLrcSubs;
        this.enableSrtSubs = this.$store.state.enableSrtSubs;
    }
}
</script>

<style scoped>
#modal {
    overflow-y: auto;
    /* Add scrolling on small devices */
    max-height: 100%;
    /* Adjust this to your needs */
}

@media screen and (min-width:760px) {
    #modal {
        max-height: none;
        /* optional: remove the max-height on large screens, adjust the width value according to your needs */
    }
}

.modal-content {
    padding: 20px;
    background-color: white;
    border-radius: 10px;
}
</style>