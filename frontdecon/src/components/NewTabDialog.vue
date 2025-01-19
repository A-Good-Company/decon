<template>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card :theme="isDark ? 'dark' : 'light'" class="new-tile-dialog">
        <v-card-title>
          Create New Tile
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-btn
                  block
                  color="primary"
                  @click="createTextTile"
                >
                  New Text Editor
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-btn
                  block
                  color="secondary"
                  @click="createChatTile"
                >
                  New Chat
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="closeDialog"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    name: 'NewTileDialog',
    data() {
      return {
        dialog: false,
        isDark: document.body.classList.contains('dark-mode')
      }
    },
    methods: {
      showDialog() {
        this.isDark = document.body.classList.contains('dark-mode')
        this.dialog = true
      },
      closeDialog() {
        this.dialog = false
      },
      createTextTile() {
        this.$emit('create-text-tile')
        this.closeDialog()
      },
      createChatTile() {
        this.$emit('create-chat-tile')
        this.closeDialog()
      }
    }
  }
  </script>
  
  <style scoped>
  .new-tile-dialog {
    border-radius: 8px;
  }
  </style>