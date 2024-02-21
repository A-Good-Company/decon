<script>
import {InkMde} from 'ink-mde/vue'
import {onMounted, reactive, ref, watch } from 'vue'

export default {
  components: {InkMde},
  props: ['tileContent', 'readonly'],
  setup(props, {emit}) {
    // const selectedText = ref(null);
    // const startSelectionPosition = ref(null);
    // const endSelectionPosition = ref(null);
    
    const markdown = ref(props.tileContent)

    const options = reactive({
      interface: {
        appearance: 'light',
        attribution: false,
        readonly: props.readonly
      },
    });

    onMounted(() => {
      //todo: Make the emit specific to parent, right now its being acknowledged by all the listeners in tiles
      document.addEventListener('selectionchange', () => {
        var selectionRange = window.getSelection()
        console.log("Selection range: " + JSON.stringify(selectionRange))
        var selectionText = selectionRange.toString()
        emit('textSelected', 
          selectionText
        );
      });
    });
    
    watch(() => props.tileContent, (newVal) => {
      console.log("tilecontent changed")
      if (newVal !== markdown.value) {
        markdown.value = newVal;
      }
    });

    watch(markdown, (content) => {
      emit('updateContent', content)
    });

    watch(() => props.readonly, (newVal) => {
      options.interface.readonly = newVal
    })
    
    return {
      markdown, 
      options,
    }
  },
}

</script>

<template>
  <div>
    <InkMde id="mdeditor" v-model="markdown" :options="options" :readonly="options.interface.readonly"/>
  </div>
</template>

<style scoped>
/* Apply

  the custom CSS property to the InkMde component */
#mdeditor {
  /* --ink-block-background-color: lightgrey; */
  --ink-editor-line-height: 20px;
  --ink-block-padding: 0rem;
  --ink-block-max-height: 30em; 
  max-height: 70vh;
  overflow-y:auto;
}

#mdeditor > * {
  overflow-y: hidden;
}
#mdeditor[readonly] {
  filter: blur(1px);
  pointer-events: none;
}

.mdeditor p {
  margin: 2px;
}
</style>