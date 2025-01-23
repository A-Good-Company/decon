<template>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          Attach Files
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
  
        <v-card-text>
          <v-btn
            class="mb-4"
            block
            @click="triggerFolderInput"
            color="primary"
          >
            Select Folder
          </v-btn>
          
          <input
            type="file"
            ref="folderInput"
            style="display: none"
            webkitdirectory
            @change="handleFolderSelect"
          >
  
          <v-list v-if="files.length > 0" class="file-list">
            <v-list-item>
              <v-list-item-content>
                <v-checkbox
                  v-model="selectAll"
                  label="Select All"
                  @change="toggleSelectAll"
                ></v-checkbox>
              </v-list-item-content>
            </v-list-item>
            
            <v-list-item v-for="file in files" :key="file.path">
              <v-list-item-content class="file-item">
                <v-checkbox
                  v-model="selectedFiles"
                  :value="file"
                >
                  <template v-slot:label>
                    <div class="file-info">
                      <span class="file-name">{{ getFileName(file) }}</span>
                      <span class="file-path">{{ getFilePath(file) }}</span>
                    </div>
                  </template>
                </v-checkbox>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
  
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="importSelected"
            :disabled="!selectedFiles.length"
          >
            Import Selected ({{ selectedFiles.length }})
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    name: 'AttachDialog',
    data() {
      return {
        dialog: false,
        files: [],
        selectedFiles: [],
        selectAll: false
      }
    },
    methods: {
      showDialog() {
        this.dialog = true
      },
      triggerFolderInput() {
        this.$refs.folderInput.click()
      },
      async handleFolderSelect(event) {
        this.files = Array.from(event.target.files)
          .filter(file => file.type === 'text/plain' || 
                         file.type === 'text/markdown' || 
                         file.name.endsWith('.md') || 
                         file.name.endsWith('.txt') ||
                         file.name.endsWith('.js') ||
                         file.name.endsWith('.vue') ||
                         file.name.endsWith('.py') ||
                         file.name.endsWith('.css'))
        this.selectedFiles = []
        this.selectAll = false
      },
      toggleSelectAll() {
        this.selectedFiles = this.selectAll ? [...this.files] : []
      },
      getFileName(file) {
        return file.name
      },
      getFilePath(file) {
        // Remove the filename from the path
        const pathParts = file.webkitRelativePath.split('/')
        pathParts.pop() // Remove filename
        return pathParts.join('/')
      },
      async importSelected() {
        let combinedContent = ''
        for (const file of this.selectedFiles) {
          const content = await this.readFileContent(file)
          combinedContent += `\`\`\`${file.webkitRelativePath}\n${content}\n\`\`\`\n\n`
        }
        this.$emit('import-files', combinedContent)
        this.dialog = false
        this.files = []
        this.selectedFiles = []
      },
      async readFileContent(file) {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target.result)
          reader.readAsText(file)
        })
      }
    }
  }
  </script>
  
  <style scoped>
  .file-list {
    max-height: 400px;
    overflow-y: auto;
  }
  
  .file-item {
    padding: 4px 0;
  }
  
  .file-info {
    display: flex;
    flex-direction: column;
  }
  
  .file-name {
    font-weight: bold;
  }
  
  .file-path {
    font-size: 0.8em;
    color: #666;
  }
  
  /* Dark mode support */
  :deep(.dark-mode) .file-path {
    color: #999;
  }
  </style>
  