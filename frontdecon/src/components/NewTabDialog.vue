<template>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>Create New Tab</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-btn
                  block
                  color="primary"
                  @click="createTextEditor"
                >
                  New Text Editor
                </v-btn>
              </v-col>
              
              <v-col cols="12">
                <v-btn
                  block
                  color="primary"
                  @click="createChatTile"
                >
                  New Chat
                </v-btn>
              </v-col>
  
              <v-col cols="12">
                <div class="file-controls">
                  <input
                    @change="handleFileLoad"
                    type="file"
                    id="file-upload"
                    style="display: none"
                  >
                  <v-btn
                    block
                    color="primary"
                    @click="triggerFileInput"
                  >
                    Load File
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            text
            @click="closeDialog"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dialog: false,
      }
    },
    methods: {
      showDialog() {
        this.dialog = true
      },
      closeDialog() {
        this.dialog = false
      },
      createTextEditor() {
        this.$emit('create-text-tile')
        this.closeDialog()
      },
      createChatTile() {
        this.$emit('create-chat-tile')
        this.closeDialog()
      },
      triggerFileInput() {
        document.getElementById('file-upload').click()
      },
      handleFileLoad(event) {
        this.$emit('load-file', event.target.files[0])
        this.closeDialog()
      }
    }
  }
  </script>
  
  <style scoped>
  .file-controls {
    width: 100%;
  }
  </style>