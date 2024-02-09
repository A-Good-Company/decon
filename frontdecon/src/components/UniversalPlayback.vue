<template>
    <div>
      <!-- Playback Controls -->
      <button @click="playMedia">Play</button>
      <button @click="pauseMedia">Pause</button>
      <input type="range" min="0" max="100" v-model="seekPosition" @input="seekMedia">
  
      <!-- Display Current State -->
      <div>Current Position: {{ currentPosition }}%</div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        seekPosition: 0,
        currentPosition: 0,
        intervalId: null
      };
    },
    methods: {
      playMedia() {
        this.getMediaElements().forEach(el => {
          if (!el.paused) return; // Skip if already playing
          el.play();
        });
        this.startTracking();
      },
      pauseMedia() {
        this.getMediaElements().forEach(el => el.pause());
        this.stopTracking();
      },
      seekMedia() {
        const seekTime = (this.seekPosition / 100);
        
        this.getMediaElements().forEach(el => {
          const time = seekTime * el.duration;
          el.currentTime = time;
        });
        
        // Directly update currentPosition since user is seeking
        this.currentPosition = this.seekPosition;
      },
      
      getMediaElements() {
        // Assuming MediaLoader components have a specific class for easy selection
        return [...document.querySelectorAll('.media-loader-video, .media-loader-audio')];
      },
  
      startTracking() {
        if (this.intervalId != null) return; // Prevent multiple intervals
  
        this.intervalId = setInterval(() => {
          const mediaElements = this.getMediaElements();
  
          if (mediaElements.length > 0) { 
            const firstElement = mediaElements[0]; // Assume synchronized media for tracking
            const positionPercentage = (firstElement.currentTime / firstElement.duration) * 100;
            this.currentPosition = positionPercentage.toFixed(2);
            this.seekPosition = positionPercentage.toFixed(2);
          }
          
        }, 1000); // Update every second
      },
  
      stopTracking() {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
  }
  </script>
  
  <style scoped>
  /* Add styles here */
  </style>