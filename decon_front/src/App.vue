<template>
  <div id="app">
    <inkmde :tileContent="content" :readonly="false" @updateContent="updateContent" @textSelected="handleTextSelected"/>
    <button class="ai-complete-button" @click="handleAIComplete">AI Complete</button>
  </div>
</template>

<script>
import InkMde from './components/InkMde';

export default {
  name: 'App',
  data() {
    return {
      content: '',
    };
  },
  components: {
    'inkmde': InkMde
  },
  methods: {
    updateContent(newContent) {
      this.content = newContent;
    },
    handleTextSelected(selectedText) {
      console.log('Selected text:', selectedText);
    },
    handleAIComplete() {
      console.log('AI Complete button clicked');
      // Add your AI completion logic here
    }
  }
}
</script>
<style>
.editor-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.ai-complete-button {
  margin-top: 10px;
}
</style>