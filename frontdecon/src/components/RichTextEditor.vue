<template>
    <div style="border: 1px solid #ccc" class="editor-container">
      <!-- <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      /> -->
      <Editor
        style="height: 100px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      />
    </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css' // import css

import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { 
    Editor, 
    // Toolbar 
} from '@wangeditor/editor-for-vue'
import { i18nChangeLanguage } from '@wangeditor/editor'


export default {
  components: { Editor},
  setup() {
    i18nChangeLanguage('en')

    // editor instance, use `shallowRef`
    const editorRef = shallowRef()

    // content HTML
    const valueHtml = ref('<p>hello</p>')

    // Simulate ajax async set HTML
    onMounted(() => {
        // setTimeout(() => {
        //     valueHtml.value = '<p>Ajax async set HTML.</p>'
        // }, 1500)
    })

    const toolbarConfig = {}
    const editorConfig = { placeholder: 'Type here...' }

    // Timely destroy `editor` before vue component destroy.
    onBeforeUnmount(() => {
        const editor = editorRef.value
        if (editor == null) return
        editor.destroy()
    })

    const handleCreated = (editor) => {
      editorRef.value = editor // record editor instance
    }

    return {
      editorRef,
      mode: 'default', // or 'simple'
      valueHtml,
      toolbarConfig,
      editorConfig,
      handleCreated
    };
  }
}
</script>   

<style scoped>
.editor-container {
    max-width: 90%; /* adjusts the maximum width */
}
</style>