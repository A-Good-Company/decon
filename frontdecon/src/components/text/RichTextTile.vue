<template>
    <div class="rich-text-tile">
        <h3><input type="text" v-model="header" class="tile-header" /></h3>
        <markdown-editor class="markdownEditor" :tileContent="content" @updateContent="handleUpdateContentFromEditor"
            @textSelected="handleTextSelected" :readonly="isEditorReadOnly" />
        <my-button type="close" @clickButton="close">Close</my-button>
        <my-button type="default" @clickButton="handleGenerateText">Hallucinate</my-button>
        <my-button type="message" @clickButton="handleMessageClick"> {{ $store.state.model }} , {{
            $store.state.tokenCount }} tokens</my-button>
        <input type="checkbox" id="pin-checkbox" value="Pinned" v-model="isPinned">
        <label for="pin-checkbox">Pin this item</label>
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
        'my-button': MyButton
    },

    computed: {
        isEditorReadOnly: function () {
            return this.lockContentUpdates; // returns true if the process button was clicked
        }
    },
    props: ['id', 'myKey', 'initcontent', 'initheader'],
    data() {
        return {
            interval: null,
            content: this.initcontent || '',
            header: this.initheader || this.initcontent.substring(0, 8) || `Tile #${this.myKey}`,
            selectedContent: '',
            lockContentUpdates: false,
            isPinned: false
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
            this.lockContentUpdates = true;

            // generates text based on selected text or the entire content
            const inputText = this.selectedContent.length > 0 ? this.selectedContent : this.content;
            const result = await openai.generateText(inputText);
            this.lockContentUpdates = false;

            if (this.selectedContent.length > 0) {
                this.$emit('newTile', this.selectedContent + '\n' + result);
            } else {
                this.content += result;
            }
        },
        handleMessageClick() {
            this.$emit('openSettings');
        }
    },
    watch: {
        isPinned(newVal) {
            if (newVal) {
                //If checkbox is ticked, add item into pinnedItems
                this.$store.commit('addPinnedItem', { id: this.myKey, content: this.content });
            } else {
                //If checkbox is unticked, remove the item from pinnedItems
                this.$store.commit('removePinnedItem', this.myKey);
            }
        }
    },
    created() {
        this.isPinned = !!this.$store.state.pinnedItems[this.myKey];
    }
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
