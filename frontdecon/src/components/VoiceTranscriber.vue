<template>
    <v-btn
        size="small"
        variant="outlined"
        :color="isVADStarted ? 'success' : 'default'"
        @click="toggleVADdetection"
        class="action-button"
    >
        <v-icon size="small" class="mr-1">
            {{ isVADStarted ? 'mdi-microphone' : 'mdi-microphone-outline' }}
        </v-icon>
        {{ isVADStarted ? 'Stop' : 'Speech' }}
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
        }
    },
    methods: {
        async toggleVADdetection() {
            if (this.isVADStarted) {
                this.myvad.pause();
                this.isVADStarted = false;
            } else {
                this.myvad = this.myvad ||await MicVAD.new({
                    onSpeechEnd: async (audio) => {
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
</style>