<template>
  <div id="editor">
    <button @click="openEditor">Open Editor</button>
    <div v-html="content"></div>
  </div>
</template>

<script>
import Stackedit from 'stackedit-js';

export default {
  data() {
    return {
      content: '',
    };
  },
  methods: {
    openEditor() {
      const stackedit = new Stackedit();

      // Open the iframe
      stackedit.openFile({
        name: 'Filename', // with an optional filename
        content: {
          text: this.content // and the markdown content.
        }
      });

      // Listen to StackEdit's events
      stackedit.on('fileChange', (file) => {
        this.content = file.content.html;  // HTML rendered from markdown
        this.$emit('input', file.content.text);  // Raw markdown content
      });
    }
  }
}
</script>

<style scoped>
  #editor {
    width: 100%;
    height: 100%;
  }
  .content {
    margin-top: 20px;
  }
</style>