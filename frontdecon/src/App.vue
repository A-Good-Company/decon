<template>
  <div class="app">
    <button @click="addTile">Add Tile</button>
    <div class="tiles-grid">
      <rich-text-tile v-for="(tile, index) in tiles" 
      :key="tile.id" 
      :myKey="tile.id"
      :id="index + 1" 
      @close="handleClose"/>
    </div>
  </div>
</template>



<script>
import RichTextTile from './components/RichTextTile.vue';

export default {
  components: {
    'rich-text-tile': RichTextTile,
  },

  data() {
    return {
      tiles: [],
      nextId: 1,
    };
  },
  methods: {
    addTile() {
      this.tiles.push({ id: this.nextId++ });
      //print the array to console
      console.log(this.tiles)
    },
    handleClose(idToRemove) {
      console.log("Befor removing")
      console.log(this.tiles)
      this.tiles = this.tiles.filter(tile => tile.id !== idToRemove);
      console.log(this.tiles)
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