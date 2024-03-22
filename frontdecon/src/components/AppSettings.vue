<template>
    <div class="pa-4 text-center">
        <v-dialog v-model="dialog" max-width="600">
            <v-card prepend-icon="mdi-account" title="Settings">
                <v-card-text>
                    <v-form>
                        <v-text-field label="Open AI Key*" v-model="openAIKey" required></v-text-field>
                        <div v-if="isOpenAICharity" class="w-full px-3 mb-6 md:mb-0">
                            <p class="text-orange-500 text-s italic">Please note, this notebook runs on limited funds.
                                If possible, consider getting your own <a class="underline"
                                    href="https://platform.openai.com/api-keys" target="_blank">OpenAI API key</a> to
                                help keep this resource free for those in need. Thanks.</p>
                        </div>
                        <v-text-field type="number" step="50" label="Token Count*" v-model="tokenCount"
                            required></v-text-field>

                        <v-select :items="['gpt-4', 'gpt-3.5-turbo-16k-0613']" label="Model for Text-AI*"
                            v-model="model" required></v-select>
                        <v-divider class="border-opacity-75" color="info"></v-divider>

                        <v-text-field label="Replicate Key*" v-model="replicateKey" required></v-text-field>
                        <div v-if="isReplicateCharity" class="w-full px-3 mb-6 md:mb-0">
                            <p class="text-orange-500 text-s italic">Please note, this notebook runs on limited funds.
                                If possible, consider getting your own <a class="underline"
                                    href="https://replicate.com/account/api-tokens" target="_blank">Replicate key</a> to
                                help keep this resource free for those in need. Thanks.</p>
                        </div>
                        <v-divider class="border-opacity-75" color="info"></v-divider>

                        <v-autocomplete v-model="selectedLanguage" :items="languages" item-title="name"
                            item-value="code" label="Select Audio Detection Language"></v-autocomplete>
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

                    </v-form>

                    <small class="text-caption text-medium-emphasis">*indicates required field</small>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>

                    <v-btn color="primary" text="Save" variant="tonal" @click="apply"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import languages from '../assets/languages.json';

export default {
    data: () => ({
        dialog: false,
        openAIKey: '',
        replicateKey: '',
        tokenCount: '',
        model: '',
        selectedLanguage: '',
        languages: languages,
        enableLrcSubs: false,
        enableSrtSubs: false,
    }),
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
    watch: {
        dialog(newValue) {
            if(!newValue) {
                this.$emit('hideSettings')
            }
        }
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

            this.updateEnableLrcSubs(this.enableLrcSubs);
            this.updateEnableSrtSubs(this.enableSrtSubs);
            this.$emit('hideSettings')

            this.dialog = false;
        },
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
        this.updateEnableLrcSubs(this.$store.state.enableLrcSubs);
        this.updateEnableSrtSubs(this.$store.state.enableSrtSubs);
        this.dialog = true;
    },
}
</script>