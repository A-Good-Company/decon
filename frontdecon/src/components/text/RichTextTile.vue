<template>
    <div class="rich-text-tile">
        <h3><input type="text" v-model="header" class="tile-header" /></h3>
        <markdown-editor class="markdownEditor" :tileContent="content" @updateContent="handleUpdateContentFromEditor"
            @textSelected="handleTextSelected" :readonly="isEditorReadOnly" />
        <my-button type="close" @clickButton="close">Close</my-button>
        <my-button type="default" @clickButton="handleGenerateText">Hallucinate</my-button>
        <my-button type="message" @clickButton="handleMessageClick">  {{  $store.state.model }} , {{  $store.state.tokenCount }} tokens</my-button>

    </div>
</template>

<style scoped></style>

<script>
// import RichTextEditor from './RichTextEditor.vue';
import MarkdownEditor from './MarkdownEditor.vue';
// import TextProcessOptions from './TextProcessOptions.vue';
import openai from '@/utils/openai'
import MyButton from '../items/ThemedButton.vue';
// import {ref} from 'vue'

export default {
    components: {
        // 'rich-text-editor' : RichTextEditor,
        'markdown-editor': MarkdownEditor,
        // 'text-process-options': TextProcessOptions,
        'my-button':MyButton
    },

    computed: {
        isEditorReadOnly: function () {
            return this.lockContentUpdates; // returns true if the process button was clicked
        }
    },
    props: ['id', 'myKey', 'initcontent'],
    data() {
        return {
            interval: null,
            content: this.initcontent || '',
            header: this.initcontent.substring(0, 8) || `Tile #${this.myKey}`,
            selectedContent: '',
            lockContentUpdates: false
        };
    },
    methods: {
        close() {
            console.log("Test close button")
            this.$emit('close', this.myKey);
        },
        handleUpdateContentFromEditor(newContent) {
            if (this.lockContentUpdates == false) {
                console.log("handleUpdateFromEditor:" + newContent);
                this.content = newContent;

            } else {
                console.log("HandleupdateFromEditor disabled")
            }
        },

        handleTextSelected(selectedContent) {
            this.selectedContent = selectedContent
        },
        async handleGenerateText() {
            console.log("generate text clicked")
            if (this.selectedContent.length > 0) {
                this.lockContentUpdates = true;
                const result = await openai.generateText(this.selectedContent);
                this.$emit('newTile', this.selectedContent + '\n' + result);
                this.lockContentUpdates = false;
            } else {
                this.lockContentUpdates = true
                const result = await openai.generateText(this.content);
                console.log("updating content:" + this.content + "\nWith result" + result);
                this.content += result;
                this.lockContentUpdates = false;
            }
        },
        handleMessageClick(){
            this.$emit('openSettings');
        }
    },
};
</script>


<style scoped>
.markdownEditor {}


h3 {
    font-weight: bold;
    font-size: 2em;
}


.timer {}

.popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    background-color: white;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
</style>


