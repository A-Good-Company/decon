<template>
    <v-card class="video-tile vide-dark-card mx-1 my-1" variant="outlined">
        <v-card-title class="headline">

            <h4><input type="text" v-model="header" class="tile-header" /></h4>
        </v-card-title>
        <v-card-text>
            <video class="media-loader-video" v-if="mediaType === 'video'" controls>
                <source :src="fileContent" :type="mime">
            </video>
            <audio class="media-loader-audio" v-if="mediaType === 'audio'" controls>
                <source :src="fileContent" :type="mime">
            </audio>

            <v-btn density="default" flat class="mx-1" size="small" color="pink" @click="close">Close</v-btn>
            <v-btn density="default" flat class="mx-1" size="small" color="blue" @click="handleDetectText">
                {{ isGuessing ? 'Guessing...' : 'Guess Words' }}
            </v-btn>
            <v-btn variant="outlined" size="small" class="mx-1 my-1 lang-btn" @click="handleSettingsClick">
                {{ $store.state.whisperLanguage }}
            </v-btn>
            <v-btn class="mx-1" flat size="small" color="green" @click="handleIsolateStem">
                {{ isIsolating ? 'Isolating...' : 'Isolate audio component' }}
            </v-btn>
        </v-card-text>
    </v-card>
</template>

<style scoped></style>

<script>
import openai from '@/utils/openai';
import replicate from '@/utils/replicate'


export default {
    components: {
    },

    props: ['id', 'myKey', 'mime', 'fileContent', 'file'],
    data() {
        return {
            mediaType: this.mime.split('/')[0],
            header: this.file.name,
            isGuessing: false,
            isIsolating: false
        };
    },
    methods: {
        close() {
            this.$emit('close', this.myKey);
        },
        process() {

        },
        handleSettingsClick() {
            this.$emit('openSettings');
        },
        async handleDetectText() {
            this.isGuessing = true;
            const result = await openai.detectText(this.file);
            const baseName = this.header.split('.').slice(0, -1).join('.') || this.header;
            console.log(baseName);
            if (this.$store.state.enableLrcSubs) {
                this.$emit("newTextTile", `${baseName}.lrc`, result.lrc);
            }
            await new Promise(resolve => setTimeout(resolve, 50)); //stopgap fix to avoid both tiles having the same id
            if (this.$store.state.enableSrtSubs) {
                this.$emit("newTextTile", `${baseName}.srt`, result.srt);
            }
            await new Promise(resolve => setTimeout(resolve, 50)); //stopgap fix to avoid both tiles having the same id
            this.$emit("newTextTile", `${baseName}.md`, result.text);
            this.isGuessing = false;
        },
        async handleIsolateStem() {
            this.isIsolating = true;

            const id = await replicate.submitReplicateSplitDemucs(this.file);

            const intervalID = setInterval(async () => {
                let status = await replicate.checkStatus(id);
                if (status !== 'succeeded') {
                    console.log(status);
                } else {
                    clearInterval(intervalID);
                    const output = await replicate.getOutput(id);
                    console.log('output', output);
                    for (let title in output) {
                        const url = output[title];
                        console.log(url, title);
                        if (url) {
                            this.$emit("newMediaTile", { url: url, title: `${title} ${this.file.name}` })
                        }
                    }
                }
            }, 30000);
        }
    },
    mounted() {
        console.log(this.mime)
    }
};
</script>


<style scoped>
h3 {
    font-weight: bold;
    font-size: 2em;
}
</style>