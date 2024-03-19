<template>
    <div class="video-tile">
        <h3><input type="text" v-model="header" class="tile-header" /></h3>

        <video class="media-loader-video" v-if="mediaType === 'video'" controls>
            <source :src="fileContent" :type="mime">
        </video>
        <audio class="media-loader-audio" v-if="mediaType === 'audio'" controls>
            <source :src="fileContent" :type="mime">
        </audio>

        <my-button type="close" @clickButton="close">Close</my-button>
        <my-button type="default" @clickButton="handleDetectText">
            {{ isGuessing ? 'Guessing...' : 'Guess Words' }}</my-button>
        <my-button type="default" @clickButton="handleIsolateStem">
            {{ isIsolating ? 'Isolating...' : 'Isolate audio component' }}</my-button>

        <my-button type="message" @clickButton="handleSettingsClick"> {{ $store.state.whisperLanguage }} </my-button>
    </div>
</template>

<style scoped></style>

<script>
import MyButton from './items/ThemedButton.vue';
import openai from '@/utils/openai';
import replicate from '@/utils/replicate'


export default {
    components: {
        'my-button': MyButton
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
            if (this.$store.state.enableLrcSubs){
                this.$emit("newTextTile",`${baseName}.lrc`, result.lrc);
            }
            if (this.$store.state.enableSrtSubs){
                this.$emit("newTextTile",`${baseName}.srt`, result.srt);
            }
            this.$emit("newTextTile",`${baseName}.md`,  result.text);
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
                            this.$emit("newMediaTile", {url: url, title: `${title} ${this.file.name}`})
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