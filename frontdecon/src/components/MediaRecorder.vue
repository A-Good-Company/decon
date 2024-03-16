<template>
    <div
        class="bg-gray-200 text-gray-900 text-l rounded-md min-h-[32px] px-3 py-0.5 font-semibold hover:bg-gray-400 m-1 w-2/4 items-center ">
        <button @click="initiateRecording">
            {{ isRecording ? 'End Recording ('+ Math.floor(elapsedSeconds/60) + ':' + ('0' + elapsedSeconds%60).slice(-2) + ')' : 'Start Recording' }}
        </button>
        <select v-model="selectedDeviceId" class="max-w-full">
            <option v-for="device in devices" :key="device.deviceId" :value="device.deviceId">
                {{ device.label || device.deviceId }}
            </option>
        </select>
    </div>
</template>


<script>
export default {
    data() {
        return {
            mediaRecorder: null,
            chunks: [],
            audio: null,
            isRecording: false,
            devices: [],
            selectedDeviceId: null,
            elapsedSeconds: 0,

        }
    },
    methods: {

        async initiateRecording() {
            if (this.isRecording) {
                this.stopRecording();
            } else {
                if (this.devices.length === 0) {
                    await this.getDevices();
                }
                await this.startRecording();
            }
        },

        async getDevices() {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            this.devices = (await navigator.mediaDevices.enumerateDevices())
                .filter(device => device.kind === 'audioinput');
            this.selectedDeviceId = this.devices[0]?.deviceId;

            // stop the streams
            if (stream) { stream.getTracks().forEach(track => track.stop()) }
        },

        async startRecording() {
            if (!this.selectedDeviceId) return;

            const stream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: this.selectedDeviceId } });

            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.start();
            this.isRecording = true;

            // start the timer
            this.elapsedSeconds = 0;
            this.intervalId = setInterval(() => {
                this.elapsedSeconds += 1;
            }, 1000);

            this.mediaRecorder.ondataavailable = (e) => {
                this.chunks.push(e.data);
            };
        },

        stopRecording() {
            if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
                this.mediaRecorder.stop();
                this.mediaRecorder.onstop = () => {
                    this.finalizeRecording();
                };
            }
        },

        finalizeRecording() {
            // stop the timer
            clearInterval(this.intervalId);
            this.elapsedSeconds = 0;

            this.audio = new Blob(this.chunks, { 'type': 'audio/webm; codecs=opus' });
            const timestamp = new Date().getTime();

            const file = new File([this.audio], `recording_${timestamp}.webm`, {
                type: 'audio/webm; codecs=opus',
                lastModified: Date.now()
            });

            this.chunks = [];
            this.isRecording = false;

            this.$emit('audioFile', file);
        },
    }
}
</script>