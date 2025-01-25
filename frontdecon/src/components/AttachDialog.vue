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
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-btn
                block
                @click="triggerFolderInput"
                color="primary"
                class="mb-2"
              >
                Select Folder
              </v-btn>
              
              <v-btn
                block
                @click="triggerFilesInput"
                color="primary"
              >
                Select Files
              </v-btn>
              
              <input
                type="file"
                ref="folderInput"
                style="display: none"
                webkitdirectory
                @change="handleFolderSelect"
              />

              <input
                type="file"
                ref="filesInput"
                style="display: none"
                multiple
                @change="handleFilesSelect"
              />
            </v-col>

            <!-- Only show file selection list for folder uploads -->
            <v-col cols="12" v-if="showFileSelection && files.length > 0">
              <div class="file-list">
                <div class="select-all-checkbox">
                  <v-checkbox
                    v-model="selectAll"
                    label="Select All"
                    @change="toggleSelectAll"
                    hide-details
                  />
                </div>

                <div v-for="file in files" :key="file.id" class="file-item">
                  <v-checkbox
                    v-model="selectedFilesPaths"
                    :value="file.path"
                    hide-details
                    @change="handleSingleFileSelection"
                  >
                    <template v-slot:label>
                      <div class="file-info">
                        <span class="file-name">{{ getFileName(file) }}</span>
                        <span class="file-path">{{ getFilePath(file) }}</span>
                      </div>
                    </template>
                  </v-checkbox>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions v-if="showFileSelection">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="importSelected"
          :disabled="!selectedFilesPaths.length"
        >
          Import Selected ({{ selectedFilesPaths.length }})
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
      selectedFilesPaths: [],
      selectAll: false,
      showFileSelection: false, // New flag to control file selection visibility
    };
  },
  methods: {
    showDialog() {
      this.dialog = true;
    },
    triggerFolderInput() {
      this.$refs.folderInput.click();
    },
    triggerFilesInput() {
      this.$refs.filesInput.click();
    },
    isTextFile(file) {
      const textExtensions = [
        '.txt', '.md', '.markdown',
        '.js', '.jsx', '.ts', '.tsx',
        '.vue', '.py', '.ruby', '.rb',
        '.java', '.cpp', '.c', '.h', '.hpp',
        '.css', '.scss', '.sass', '.less',
        '.html', '.htm', '.xml', '.json',
        '.yaml', '.yml', '.ini', '.config',
        '.log', '.env', '.sh', '.bash',
        '.sql', '.php', '.go', '.rs',
        '.swift', '.kt', '.gradle',
        '.properties', '.conf', '.cfg'
      ];
      
      const isTextMime = file.type.startsWith('text/') || 
                        file.type === 'application/json' ||
                        file.type === 'application/xml' ||
                        file.type === 'application/x-yaml';

      const hasTextExtension = textExtensions.some(ext => 
        file.name.toLowerCase().endsWith(ext)
      );

      return isTextMime || hasTextExtension;
    },
    async handleFolderSelect(event) {
      const selectedFiles = Array.from(event.target.files)
        .filter(file => this.isTextFile(file))
        .map(file => ({
          id: `folder-${file.webkitRelativePath}`,
          file: file,
          path: file.webkitRelativePath,
          type: 'folder'
        }));
      
      this.files = selectedFiles;
      this.selectedFilesPaths = [];
      this.selectAll = false;
      this.showFileSelection = true; // Show file selection for folder upload
    },
    async handleFilesSelect(event) {
      const selectedFiles = Array.from(event.target.files)
        .filter(file => this.isTextFile(file));
      
      // Directly process and import the files
      this.importFiles(selectedFiles);
    },
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedFilesPaths = this.files.map(file => file.path);
      } else {
        this.selectedFilesPaths = [];
      }
    },
    handleSingleFileSelection() {
      this.selectAll = this.selectedFilesPaths.length === this.files.length;
    },
    getFileName(file) {
      return file.file.name;
    },
    getFilePath(file) {
      if (file.type === 'folder') {
        const pathParts = file.path.split('/');
        pathParts.pop();
        return pathParts.join('/');
      }
      return '';
    },
    async importSelected() {
      const selectedFiles = this.files
        .filter(f => this.selectedFilesPaths.includes(f.path))
        .map(f => f.file);
      
      await this.importFiles(selectedFiles);
    },
    async importFiles(files) {
      let combinedContent = '';
      for (const file of files) {
        const content = await this.readFileContent(file);
        const path = file.webkitRelativePath || file.name;
        combinedContent += `\`\`\`${path}\n${content}\n\`\`\`\n\n`;
      }
      
      this.$emit('import-files', combinedContent);
      this.dialog = false;
      this.files = [];
      this.selectedFilesPaths = [];
      this.showFileSelection = false;
    },
    async readFileContent(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsText(file);
      });
    },
  },
};
</script>

<style scoped>
.file-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
}

.select-all-checkbox {
  margin-bottom: 8px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.file-item {
  margin: 4px 0;
}

.file-info {
  display: flex;
  flex-direction: column;
  padding: 4px 0;
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

:deep(.dark-mode) .select-all-checkbox {
  border-bottom-color: #333;
}
</style>