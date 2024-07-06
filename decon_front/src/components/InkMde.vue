<template>
    <div class="ink-mde-container">
      <InkMde ref="mdeditor" id="mdeditor" v-model="markdown" :options="options" :readonly="options.interface.readonly" />
    </div>
  </template>
  
  <script>
  import { InkMde } from 'ink-mde/vue'
  import { onMounted, reactive, ref, watch } from 'vue'
  
  export default {
    components: { InkMde },
    props: ['tileContent', 'readonly'],
    setup(props, { emit }) {
      const mdeditor = ref(null);
      const markdown = ref(props.tileContent)
  
      const options = reactive({
        interface: {
          appearance: 'light',
          attribution: false,
          readonly: props.readonly
        },
      });
  
      onMounted(() => {
        function updateSelectedText() {
          var selectionRange = window.getSelection();
          var selectionText = selectionRange.toString();
          emit('textSelected', selectionText);
        }
  
        // Updated the selected text when the selection changes
        document.addEventListener('selectionchange', updateSelectedText);
  
        // Also update the selected text when a key is released
        document.addEventListener('keyup', updateSelectedText);
      });
  
      watch(() => props.tileContent, (newVal) => {
        console.log("tilecontent changed")
        if (newVal !== markdown.value) {
          markdown.value = newVal;
        }
      });
  
      watch(markdown, (content) => {
        emit('updateContent', content)
  
        //  Scroll to end when markdown content changes
        if (mdeditor.value) {
          mdeditor.value.$el.scrollTop = mdeditor.value.$el.scrollHeight;
        }
      });
  
      watch(() => props.readonly, (newVal) => {
        options.interface.readonly = newVal
      })
  
      return {
        markdown,
        options,
        mdeditor
      }
    },
  }
  </script>
<style>
.ink {
  height: 90vh;
  overflow-y: auto;
  padding: 0em;
  --ink-padding: 0em;
  --ink-block-padding: 0em;
  outline: 2px solid #007bff; /* Change color and style as needed */

}
.ink-mde-container .cm-focused {
    outline: 1px dotted #ffffff;
}
#mdeditor {
    --ink-editor-padding: 0em;

}
</style>