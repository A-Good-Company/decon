<template>
  <div class="app">
    <button @click="addTile">Add Tile</button>
    <div class="tiles-grid">
      <text-tile v-for="(tile, index) in tiles" :key="tile.id" :id="index + 1" />
    </div>
  </div>
</template>


<script>
// import Tile from './componenets/BaseTile.vue';
import TextTile from './tiles/TextTile.vue';

export default {
  components: {TextTile},

  data() {
    return {
      tiles: [],
      nextId: 1,
    };
  },
  methods: {
    addTile() {
      this.tiles.push({ id: this.nextId++ });
    },
  }
}
</script>


<style scoped>

.app {

}

.tiles-grid {

}

</style>