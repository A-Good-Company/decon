<template>
    <div class="audio-player">
      <button @click="playPause">
        {{ playing ? 'Pause' : 'Play' }}
      </button>
      <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="changeVolume"/>
      <span>Volume: {{ volume }}</span>
    </div>
  </template>
  
  <script>
  import { Howl } from 'howler';
  
  export default {
    data() {
      return {
        sound: null,
        playing: false,
        volume: 1 // Volume range between 0.0 and 1.0
      };
    },
    methods: {
      initSound() {
        this.sound = new Howl({
          src: ['audio/accompaniment.mp3'], // Add your audio file path here
          volume: this.volume,
          onplay: () => { this.playing = true; },
          onpause: () => { this.playing = false; },
          onstop: () => { this.playing = false; },
          onend: () => { this.playing = false; }
        });
      },
      playPause() {
        if (this.sound.playing()) {
          this.sound.pause();
        } else {
          if (!this.sound) {
            this.initSound();
          }
          this.sound.play();
        }
      },
      changeVolume() {
        if (this.sound) {
          this.sound.volume(this.volume);
        }
      }
    },
    mounted() {
      this.initSound();
    },
  };
  </script>
  
  <style scoped>
  /* Add styles here */
  </style>