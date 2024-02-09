<template>
  <div class="app">
    <universal-playback/>
    <button @click="addTile">Add Text Tile</button>
    <div class="tiles-grid">
      <rich-text-tile v-for="(tile, index) in tiles" 
      :key="tile.id" 
      :myKey="tile.id"
      :id="index + 1" 
      @close="handleClose"/>
    </div>
    <button @click="addVidTile">Add Video Tile</button>
    <div class="vid-tiles-grid">
      <video-tile v-for="(tile, index) in vidTiles" 
      :key="tile.id" 
      :myKey="tile.id"
      :id="index + 1" 
      @close="handleVidClose"/>
    </div>
    <media-loader/>
  </div>
</template>



<script>
import RichTextTile from './components/RichTextTile.vue';
import VideoTile from './components/VideoTile.vue';
// import AudioPlayer from './components/AudioPlayer.vue';
import UniversalPlayback from './components/UniversalPlayback.vue';

export default {
  components: {
    'rich-text-tile': RichTextTile,
    'video-tile': VideoTile,
    // 'audio-player': AudioPlayer,
    'universal-playback': UniversalPlayback
  },

  data() {
    return {
      tiles: [],
      nextId: 1,
      vidTiles: [],
      nextVidId: 1
    };
  },
  methods: {
    addTile() {
      this.tiles.push({ id: this.nextId++ });
    },
    handleClose(idToRemove) {
      console.log("Befor removing")
      console.log(this.tiles)
      this.tiles = this.tiles.filter(tile => tile.id !== idToRemove);
      console.log(this.tiles)
      console.log("after removing")
    },
    addVidTile() {
      this.vidTiles.push({ id: this.nextVidId++ });
    },
    handleVidClose(idToRemove) {
      console.log("Befor removing")
      console.log(this.vidTiles)
      this.vidTiles = this.vidTiles.filter(tile => tile.id !== idToRemove);
      console.log(this.vidTiles)
      console.log("after removing")
    }
  }
}
</script>


<style>

button{
  padding: 2px;
  border-radius: 10%; 
  padding-right: 4px;
  background-color: rgb(124, 204, 104); 
  color: rgb(201, 81, 81); 
}

.app {

}

.tiles-grid {

}

</style>