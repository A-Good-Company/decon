<template>
    <v-card class="rich-text-tile mx-1 my-1" :variant="tileVariant" :color="tileColor">
        <v-card-title class="headline">
            <h4><input type="text" v-model="header" class="tile-header" @focus="selectAll" /></h4>
        </v-card-title>
        <v-card-text>
            <markdown-editor class="markdownEditor" :tileContent="content"
                @updateContent="handleUpdateContentFromEditor" @textSelected="handleTextSelected"
                :readonly="isEditorReadOnly" />
            <!-- <my-button type="close" @clickButton="close">Close</my-button> -->
            <v-btn density="default" flat class="mx-1" size="small" color="pink" @click="close">Close</v-btn>
            <!-- <my-button type="default" @clickButton="handleGenerateText">Hallucinate</my-button> -->
            <v-btn density="default" flat class="mx-1" size="small" color="blue"
                @click="handleGenerateText">AI-Complete</v-btn>
            <v-btn class="mx-1" flat size="small" color="green" @click="openPromptsDialog = true">My Prompts</v-btn>
            <v-chip v-if="isPrompt" size="small" color="green-darken-4">
                Prompt
            </v-chip>
            <v-chip size="small" class="mx-1">
                {{ wordCount }} Words
            </v-chip>
            <!-- <my-button type="open-dialog" @clickButton="openPromptsDialog = true">Open Dialog</my-button> -->
            <v-dialog v-model="openPromptsDialog" persistent max-width="500px">
                <v-card>
                    <v-card-title>Prompts</v-card-title>
                    <v-card-text>
                        <v-row v-for="id in Object.keys($store.state.prompts)" :key="id">
                            <v-col cols="auto">
                                <div>{{ id }}</div>
                                <div class="subtitle" style="font-size: 0.8em;">{{
        $store.state.prompts[id].content.slice(0, 40) + '...' }}</div>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col cols="auto">
                                <v-btn class="mx-1 my-1" flat size="small" color="primary"
                                    @click="runPrompt(id)">Run</v-btn>
                                <v-btn class="mx-1 my-1" flat size="small" color="secondary"
                                    @click="editPrompt(id)">Edit</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="openPromptsDialog = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-btn variant="outlined" size="small" class="mx-1 my-1" @click="handleMessageClick">
                {{ $store.state.model }}, {{ $store.state.tokenCount }} tokens
            </v-btn>
            <!-- <input type="checkbox" :id="'pin-checkbox-' + id" value="Pinned" v-model="isPinned">
        <label :for="'pin-checkbox-' + id">Pin</label>
        <label v-if="isPrompt"> Prompt</label> -->
            <v-chip size="small" color="purple">
                <input type="checkbox" :id="'pin-checkbox-' + id" :value="isPinned ? 'Pinned' : 'Pin'"
                    v-model="isPinned" class="mr-2">
                <label :for="'pin-checkbox-' + id">{{ isPinned ? 'Pinned' : 'Pin' }}</label>
            </v-chip>
            <!-- <my-button type="default" @clickButton="saveContent">Download</my-button> -->
            <v-btn class="mx-1" size="small" flat color="purple" @click="saveContent">Download</v-btn>
        </v-card-text>
    </v-card>
</template>

<style scoped></style>

<script>
// import RichTextEditor from './RichTextEditor.vue';
import MarkdownEditor from './MarkdownEditor.vue';
// import TextProcessOptions from './TextProcessOptions.vue';
import openai from '@/utils/openai'
import { format } from 'date-fns'
// import {ref} from 'vue'

export default {
    components: {
        // 'rich-text-editor' : RichTextEditor,
        'markdown-editor': MarkdownEditor,
        // 'text-process-options': TextProcessOptions,
    },

    computed: {
        isEditorReadOnly: function () {
            return this.lockContentUpdates; // returns true if the process button was clicked
        },
        isPrompt: function () {
            return this.content.includes("{{context}}");
        },
        wordCount: function () {
            return this.selectedContent ? this.selectedContent.split(' ').length : this.content.split(' ').length;
        },
    },
    props: ['id', 'myKey', 'initcontent', 'initheader'],
    data() {
        return {
            interval: null,
            content: this.initcontent || '',
            header: this.initheader || this.initcontent.substring(0, 10) || format(this.id, 'yyyyMMdd HHmm') + '.md',
            selectedContent: '',
            lockContentUpdates: false,
            isPinned: false,
            openPromptsDialog: false,
            tileColor: 'default',
            tileVariant: 'outlined'
        };
    },
    methods: {
        close() {
            if (this.isPinned) {
                this.isPinned = false;
            } else {
                this.$emit('close', this.myKey);
            }
        },
        handleUpdateContentFromEditor(newContent) {
            if (this.lockContentUpdates == false) {
                console.log("handleUpdateFromEditor:" + newContent);
                this.content = newContent;
                if (this.isPinned) {
                    this.$store.commit('updatePinnedItem', { id: this.myKey, content: this.content, header: this.header });
                }
                if (this.isPrompt) {
                    this.$store.commit('updatePrompt', { id: this.header, content: this.content });
                }
            } else {
                console.log("HandleupdateFromEditor disabled")
            }
        },

        handleTextSelected(selectedContent) {
            this.selectedContent = selectedContent
        },
        async handleGenerateText() {
            const autoCompletePrompt = "**This is a continuous document, being generated in multiple steps. If a text is incomplete, the next part should start from the next character. Please ensure each continuation logically follows from the last to maintain context and coherence.**\n\n"
            this.lockContentUpdates = true;

            // generates text based on selected text or the entire content
            const inputText = this.selectedContent.length > 0 ? this.selectedContent : this.content;
            const result = await openai.generateText(autoCompletePrompt + inputText);
            this.lockContentUpdates = false;

            if (this.selectedContent.length > 0) {
                this.$emit('newTile', this.selectedContent + '\n' + result);
            } else {
                this.content += result;
            }
        },
        handleMessageClick() {
            this.$emit('openSettings');
        },
        selectAll(event) {
            event.target.select();
        },
        saveContent() {
            const fileName = this.header;
            const contentText = this.content;

            // create a Blob from your content
            const blob = new Blob([contentText], { type: 'text/plain;charset=utf-8' });

            // create an object URL from the Blob
            const url = URL.createObjectURL(blob);

            // create an a element
            const link = document.createElement('a');
            link.download = fileName;
            link.href = url;

            // This triggers the download
            document.body.appendChild(link);
            link.click();

            // This removes the link from the body
            document.body.removeChild(link);
        },
        editPrompt(id) {
            this.$emit("newHeadedTile", id, this.$store.state.prompts[id].content);
            this.openPromptsDialog = false;
        },
        async runPrompt(id) {
            let promptTemplate = this.$store.state.prompts[id].content;
            this.openPromptsDialog = false;
            this.lockContentUpdates = true;
            const inputText = this.selectedContent.length > 0 ? this.selectedContent : this.content;

            let queryPrompt = promptTemplate.replace(/\{\{context\}\}/g, inputText);

            // generates text based on selected text or the entire content
            const result = await openai.generateText(queryPrompt);
            this.$emit('newHeadedTile', `${id}-${this.header}`, result);
            this.lockContentUpdates = false;

        },
        updateTileAppearance() {
            console.log("Updating tile colors")
            if (this.isPinned && this.isPrompt) {
                this.tileVariant = 'outlined';
                this.tileColor = 'green-darken-4';
            } else if (this.isPinned && !this.isPrompt) {
                this.tileVariant = 'outlined';
                this.tileColor = 'purple';
            } else if (!this.isPinned && this.isPrompt) {
                this.tileVariant = 'elevated';
                this.tileColor = 'light-green-lighten-5';
            } else {
                this.tileVariant = 'outlined';
                this.tileColor = 'default';
            }
        },
    },
    watch: {
        header(newHeader, oldHeader) {
            if (this.isPinned) {
                this.$store.commit('updatePinnedItem', { id: this.myKey, content: this.content, header: newHeader })
            }
            if (this.isPrompt) {
                // Remove the old prompt and add a new prompt with the updated header ID
                this.$store.commit('removePrompt', oldHeader);
                this.$store.commit('addPrompt', { id: newHeader, content: this.content });
            }
        },
        isPinned(newVal) {
            if (newVal) {
                //If checkbox is ticked, add item into pinnedItems
                this.$store.commit('addPinnedItem', { id: this.myKey, content: this.content, header: this.header });
            } else {
                //If checkbox is unticked, remove the item from pinnedItems
                this.$store.commit('removePinnedItem', this.myKey);
            }
            this.updateTileAppearance();
        },
        isPrompt(newVal) {
            if (newVal) {
                // If newVal is true, save to prompts store
                try {
                    // ensure that an item with the id doesn't already exist in the prompts list
                    if (Object.keys(this.$store.state.prompts).includes(this.header)) {
                        throw new Error("Prompt with this id already exists")
                    } else {
                        this.$store.commit('addPrompt', { id: this.header, content: this.content });
                    }
                } catch (err) {
                    console.log(err)
                }
            } else {
                // If newVal is false, revert to the initial state or any other desired state
                this.$store.commit('removePrompt', this.header);
            }
            this.updateTileAppearance();
        },
    },
    mounted() {
        this.isPinned = !!this.$store.state.pinnedItems[this.myKey];
        this.updateTileAppearance();
    },
    errorCaptured() {
        this.lockContentUpdates = false;
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
