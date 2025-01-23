<template>
    <v-card class="rich-text-tile mx-1 my-1" :variant="tileVariant" :color="tileColor">
        <v-card-text>
            <markdown-editor class="markdownEditor" :tileContent="content"
                @updateContent="handleUpdateContentFromEditor" @textSelected="handleTextSelected"
                :readonly="isEditorReadOnly" />
            <!-- <my-button type="close" @clickButton="close">Close</my-button> -->
            <!-- <my-button type="default" @clickButton="handleGenerateText">Hallucinate</my-button> -->
            <v-btn density="default" flat class="mx-1" size="small" color="blue" @click="handleGenerateText">{{
                selectedContent.length > 0 ? 'Copy To New' : 'AI-Complete' }}</v-btn>
            <v-btn class="mx-1" flat size="small" color="green" @click="openPromptsDialog = true">My Prompts</v-btn>
            <voice-transcriber @transcription="handleTranscription" />
            <audio-recorder @transcription="handleTranscription" />

            <v-chip v-if="isPrompt" size="small" color="green-darken-4">
                Prompt
            </v-chip>
            <v-chip size="small" class="mx-1 promt-words">
                {{ wordCount }} Words
            </v-chip>
            <!-- <my-button type="open-dialog" @clickButton="openPromptsDialog = true">Open Dialog</my-button> -->
            <v-dialog v-model="openPromptsDialog" persistent max-width="500px" class="dark-promt-dialog">
                <v-card class='dark-promt-card'>
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
            <v-chip size="small" color="purple" class="purple-dark-btn">
                <input type="checkbox" :id="'pin-checkbox-' + id" :value="isPinned ? 'Pinned' : 'Pin'"
                    v-model="isPinned" class="mr-2">
                <label :for="'pin-checkbox-' + id">{{ isPinned ? 'Pinned' : 'Pin' }}</label>
            </v-chip>
            <!-- <my-button type="default" @clickButton="saveContent">Download</my-button> -->
            <v-btn class="mx-1" size="small" flat color="purple" @click="saveContent">Download</v-btn>
            <v-btn icon variant="text" size="small" @click="showAttachDialog" class="ml-2">
                <v-icon>mdi-paperclip</v-icon>
            </v-btn>
            <v-btn variant="outlined" size="small" class="mx-1 my-1 outline-white-btn" @click="handleMessageClick">
                <v-icon size="small" class="mr-1">mdi-microphone</v-icon>
                {{ $store.state.whisperLanguage }} |
                <v-icon size="small" class="mx-1">mdi-text</v-icon>
                {{ $store.state.model }}, {{ $store.state.tokenCount }}t
            </v-btn>
            <attach-dialog ref="attachDialog" @import-files="handleFileImport" />
            <!-- <input type="checkbox" :id="'pin-checkbox-' + id" value="Pinned" v-model="isPinned">
        <label :for="'pin-checkbox-' + id">Pin</label>
        <label v-if="isPrompt"> Prompt</label> -->

        </v-card-text>
    </v-card>
</template>

<style scoped></style>

<script>
// import RichTextEditor from './RichTextEditor.vue';
import MarkdownEditor from './MarkdownEditor.vue';
// import TextProcessOptions from './TextProcessOptions.vue';
import openai from '@/utils/openai'
import VoiceTranscriber from '../VoiceTranscriber.vue'
import AudioRecorder from '../AudioRecorder.vue'
import AttachDialog from '../AttachDialog.vue'



import ai from '@/utils/ai'
import { format } from 'date-fns'
// import {ref} from 'vue'

export default {
    components: {
        // 'rich-text-editor' : RichTextEditor,
        'markdown-editor': MarkdownEditor,
        VoiceTranscriber,
        AudioRecorder,
        'attach-dialog': AttachDialog

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
                this.content = newContent;
                if (this.isPinned) {
                    this.$store.commit('updatePinnedItem', { id: this.myKey, content: this.content, header: this.header });
                }
                if (this.isPrompt) {
                    this.$store.commit('updatePrompt', { id: this.header, content: this.content });
                }
                //Updating header
                let firstLine = this.content.split('\n')[0].trim();
                // If first line is empty, use default text
                if (!firstLine) {
                    firstLine = 'Text Editor';
                }
                // Limit the length of the header if needed
                if (firstLine.length > 13) {
                    firstLine = firstLine.substring(0, 13) + '...';
                }

                // Emit the header update
                this.header = firstLine
                this.$emit('updateHeader', this.id, firstLine);
            } else {
                console.log("HandleupdateFromEditor disabled")
            }
        },

        handleTextSelected(selectedContent) {
            this.selectedContent = selectedContent
        },
        handleTranscription(text) {
            // Handle the transcribed text here
            // For example, append it to the current content
            this.content += text
        },
        async handleGenerateText() {
            // await openai.generateAnthropicText(this.content);
            if (!this.selectedContent.length) {

                const autoCompletePrompt = "";

                this.lockContentUpdates = true;

                try {
                    await ai.generateText(autoCompletePrompt + this.content, (chunkContent) => {
                        this.lockContentUpdates = false;
                        this.content += chunkContent;
                    }).finally(() => this.lockContentUpdates = false);
                } catch (error) {
                    console.error('Error during text generation:', error);
                    this.lockContentUpdates = false;
                    throw error;
                }

            } else this.$emit('newTile', this.selectedContent);
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
        onKeyDown(event) {
            if (event.altKey && event.key === 'Enter') {
                event.preventDefault();
                this.handleGenerateText();
            }
        },
        handleTitleChange(newTitle) {
            // Emit the new title to update the tab header
            this.$emit('updateHeader', this.id, newTitle);
        },
        showAttachDialog() {
            this.$refs.attachDialog.showDialog()
        },
        handleFileImport(content) {
            // Insert the content at the current cursor position
            const editor = this.$refs.editor
            const cm = editor.cm
            const doc = cm.getDoc()
            const cursor = doc.getCursor()
            doc.replaceRange(content, cursor)
        }
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
        window.addEventListener('keydown', this.onKeyDown);

    },
    errorCaptured() {
        this.lockContentUpdates = false;
        window.removeEventListener('keydown', this.onKeyDown);

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
