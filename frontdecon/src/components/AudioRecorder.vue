<template>
    <div class="audio-recorder">
        <v-btn
            size="small"
            variant="outlined"
            :color="isRecording ? 'error' : 'info'"
            @click="toggleRecording"
            class="action-button"
        >
            <v-icon size="small" class="mr-1">
                {{ isRecording ? 'mdi-microphone' : 'mdi-microphone-outline' }}
            </v-icon>
            {{ isRecording ? formattedTime : 'Record' }}
        </v-btn>
    </div>
</template>

<script>
import openai from '@/utils/openai'

export default {
    name: 'AudioRecorder',
    data() {
        return {
            isRecording: false,
            mediaRecorder: null,
            audioChunks: [],
            timer: 0,
            timerInterval: null
        }
    },
    computed: {
        formattedTime() {
            const minutes = Math.floor(this.timer / 60)
            const seconds = this.timer % 60
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        }
    },
    methods: {

      async toggleRecording() {
        if (!this.isRecording) {
          await this.startRecording()
        } else {
          await this.stopRecording()
        }
      },
      async startRecording() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          this.mediaRecorder = new MediaRecorder(stream)
          this.audioChunks = []
  
          this.mediaRecorder.ondataavailable = (event) => {
            this.audioChunks.push(event.data)
          }
  
          this.mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' })
            const result = await openai.detectTextFromAudioBlob(audioBlob)
            this.$emit('transcription', result.text)
          }
  
          this.mediaRecorder.start()
          this.isRecording = true
          this.startTimer()
        } catch (error) {
          console.error('Error accessing microphone:', error)
        }
      },
      async stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
          this.mediaRecorder.stop()
          this.isRecording = false
          this.stopTimer()
          
          // Stop all tracks in the stream
          this.mediaRecorder.stream.getTracks().forEach(track => track.stop())
        }
      },
      startTimer() {
        this.timer = 0
        this.timerInterval = setInterval(() => {
          this.timer++
        }, 1000)
      },
      stopTimer() {
        clearInterval(this.timerInterval)
      }
    },
    beforeUnmount() {
        this.stopTimer()
        if (this.mediaRecorder && this.isRecording) {
            this.stopRecording()
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
}

/* For initial state (light blue) */
.v-btn--variant-outlined.info {
    color: rgb(var(--v-theme-info));
    border-color: rgb(var(--v-theme-info)) !important;
}

/* For recording state (red) */
.v-btn--variant-outlined.error {
    color: rgb(var(--v-theme-error));
    border-color: rgb(var(--v-theme-error)) !important;
}

.audio-recorder {
    display: inline-flex;
    align-items: center;
}
</style>