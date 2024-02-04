<template>
  <div class="app">
    <button @click="addTile">Add Tile</button>
    <div class="tiles-grid">
      <base-tile v-for="(tile, index) in tiles" 
      :key="tile.id" 
      :myKey="tile.id"
      :id="index + 1" 
      @close="handleClose"/>
    </div>
  </div>
</template>


<script>
import BaseTile from './components/BaseTile.vue';

export default {
  components: {BaseTile},

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


<style scoped>

.app {

}

.tiles-grid {

}

</style>