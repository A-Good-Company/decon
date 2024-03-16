<template>
    <div class="bg-gray-200 text-gray-900 text-l rounded-md min-h-[32px] px-3 py-0.5 font-semibold hover:bg-gray-400 m-1 w-2/4 items-center ">
        <button type="new" @mousedown="initiateRecording()" @mouseup="stopRecording()">
            {{ isRecording ? `Recording audio, release to stop` : 'Push to record Audio' }}
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
            selectedDeviceId: null

        }
    },
    methods: {
        async initiateRecording() {
            if(this.devices.length === 0) {
                await this.getDevices();
            }
            await this.startRecording();
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

            this.mediaRecorder.ondataavailable = (e) => {
                this.chunks.push(e.data);
            };
        },

        stopRecording() {
            if (!this.mediaRecorder) return;
            this.mediaRecorder.stop();

            this.mediaRecorder.onstop = () => {
                this.finalizeRecording();
            };
        },

        finalizeRecording() {
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