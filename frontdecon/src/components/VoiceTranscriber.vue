<template>
    <v-btn
        size="small"
        variant="outlined"
        :color="getButtonColor"
        @click="toggleVADdetection"
        class="action-button"
    >
        <v-icon size="small" class="mr-1">
            {{ getButtonIcon }}
        </v-icon>
        {{ getButtonText }}
    </v-btn>
</template>

<script>
import openai from '@/utils/openai';
import { MicVAD } from '@ricky0123/vad-web';
import * as toWav from 'audiobuffer-to-wav';

export default {
    data() {
        return {
            myvad: null,
            last240chars: 'This is a conversation. Always leave a space after sentence ends like .,?',
            isVADStarted: false,
            isRecording: false
        }
    },
    computed: {
        getButtonColor() {
            if (this.isRecording) return 'error'
            if (this.isVADStarted) return 'success'
            return 'default'
        },
        getButtonIcon() {
            if (this.isRecording) return 'mdi-record'
            if (this.isVADStarted) return 'mdi-microphone'
            return 'mdi-microphone-outline'
        },
        getButtonText() {
            if (this.isRecording) return 'Recording...'
            if (this.isVADStarted) return 'Listening'
            return 'Speech'
        }
    },
    methods: {
        async toggleVADdetection() {
            if (this.isVADStarted) {
                this.myvad.pause();
                this.isVADStarted = false;
                this.isRecording = false;
            } else {
                this.myvad = this.myvad || await MicVAD.new({
                    onSpeechStart: () => {
                        this.isRecording = true;
                    },
                    onSpeechEnd: async (audio) => {
                        this.isRecording = false;
                        if (document.visibilityState === "visible") {
                            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                            const rate = 16000;
                            const length = audio.length;
                            const audioBuffer = audioCtx.createBuffer(1, length, rate);

                            for (let i = 0; i < length; i++) {
                                audioBuffer.getChannelData(0)[i] = audio[i];
                            }

                            const wav = toWav(audioBuffer);
                            const blob = new Blob([new DataView(wav)], { type: 'audio/mpeg' });

                            const detectedTextObject = await openai.detectTextFromAudioBlob(blob, this.last240chars);
                            const detectedText = detectedTextObject.text + " "

                            this.last240chars = (this.last240chars + detectedText).slice(-240);

                            if (document.activeElement.className.includes('ink-mde-editor-content') && detectedText.trim() !== '') {
                                const text = detectedText;
                                const selection = window.getSelection();
                                const range = selection.getRangeAt(0);
                                range.deleteContents();

                                const textNode = document.createTextNode(text);
                                range.insertNode(textNode);

                                selection.removeAllRanges();
                            }
                        }
                    },
                });
                this.myvad.start();
                this.isVADStarted = true;
            }
        }
    }
}
</script>

<style scoped>
.action-button {
    margin: 4px;
    text-transform: none;
}

.v-btn--variant-outlined {
    background: transparent;
    color: white;
}

/* For when speech input is active */
.v-btn--variant-outlined.success {
    color: rgb(var(--v-theme-success));
    border-color: rgb(var(--v-theme-success)) !important;
}

/* For when actually recording */
.v-btn--variant-outlined.error {
    color: rgb(var(--v-theme-error));
    border-color: rgb(var(--v-theme-error)) !important;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        opacity: 1;
    }
}
</style>