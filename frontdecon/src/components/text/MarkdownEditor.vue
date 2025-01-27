<template>
  <div>
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
      mdeditor
    }
  },
  methods: {
    scrollToBottom() {
      const scroller = this.$el.querySelector('.cm-scroller');
      if (scroller) {
        scroller.scrollTop = scroller.scrollHeight;
      }
    }
  }
}
</script>

<style scoped>
#mdeditor {
  --ink-editor-line-height: 20px;
  --ink-block-padding: 0rem;
  --ink-block-max-height: 30em;
  --ink-block-background-color: #2a2a2a;
  max-height: 70vh;
  overflow-y: auto;
}

#mdeditor>* {
  overflow-y: hidden;
}

#mdeditor[readonly] {
  filter: blur(1px);
  pointer-events: none;
}

.mdeditor p {
  margin: 2px;
}

.cm-scroller {
  overflow: auto;
  contain: content;
  will-change: transform;
  backface-visibility: hidden;
}

.cm-content {
  pointer-events: auto;
}
</style>