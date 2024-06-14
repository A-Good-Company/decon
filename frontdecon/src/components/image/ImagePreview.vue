<template>
   <div class="full-page-overlay" @click="close">
      <img :src="src" class="preview-image">
   </div>
</template>

<script>
export default {
   props: ['src'],
   methods: {
      close() {
         this.$emit('close');
      }
   }
};
</script>

<style scoped>
.full-page-overlay {
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   display: flex;
   justify-content: center;
   align-items: center;
   background-color: rgba(0, 0, 0, 0.8);
   z-index: 1000;
}

.preview-image {
   max-width: 90%;
   max-height: 90%;
}
</style>