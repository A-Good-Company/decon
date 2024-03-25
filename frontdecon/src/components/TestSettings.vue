<template>
    <div class="pa-4 text-center">
        <v-dialog v-model="dialog" max-width="600">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn class="text-none font-weight-regular" prepend-icon="mdi-account" text="Settings" variant="tonal"
                    v-bind="activatorProps"></v-btn>
            </template>

            <v-card prepend-icon="mdi-account" title="Settings">
                <v-card-text>
                    <v-form>
                        <v-text-field label="Open AI Key*" v-model="openAIKey" required></v-text-field>

                        <v-text-field label="Replicate Key*" v-model="replicateKey" required></v-text-field>

                        <v-text-field type="number" step="50" label="Token Count*" v-model="tokenCount"
                            required></v-text-field>

                        <v-select :items="['gpt-4', 'gpt-3.5-turbo-16k-0613']" label="Models*" v-model="model"
                            required></v-select>

                        <v-select :items="languages" item-text="name" item-value="code" label="Audio detection language"
                            v-model="selectedLanguage"></v-select>

                        <v-checkbox label="Enable LRC Subtitles" v-model="enableLrcSubs"></v-checkbox>

                        <v-checkbox label="Enable SRT Subtitles" v-model="enableSrtSubs"></v-checkbox>

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
            this.dialog = false;

            this.updateEnableLrcSubs(this.enableLrcSubs);
            this.updateEnableSrtSubs(this.enableSrtSubs);
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
        this.enableLrcSubs = this.$store.state.enableLrcSubs;
        this.enableSrtSubs = this.$store.state.enableSrtSubs;
    },
}
</script>