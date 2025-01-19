<template>
  <div class="app">
    <div class="header-container">
      <v-tabs v-model="activeTab" background-color="primary">
        <!-- Existing tabs -->
        <v-tab v-for="tile in tiles" :key="`text-${tile.id}`" :value="`text-${tile.id}`" class="tab-item">
          <span class="tab-label">{{ tile.initheader || 'Text Editor' }}</span>
          <button class="tab-close" @click.stop="handleClose(tile.id)">×</button>
        </v-tab>

        <v-tab v-for="tile in chatTiles" :key="`chat-${tile.id}`" :value="`chat-${tile.id}`" class="tab-item">
          <span class="tab-label">{{ tile.initheader || 'Chat' }}</span>
          <button class="tab-close" @click.stop="handleChatTileClose(tile.id)">×</button>
        </v-tab>

        <v-tab v-for="tile in mediaTiles" :key="`media-${tile.id}`" :value="`media-${tile.id}`" class="tab-item">
          <span class="tab-label">{{ tile.file?.name || 'Media' }}</span>
          <button class="tab-close" @click.stop="handleMediaClose(tile.id)">×</button>
        </v-tab>
      </v-tabs>

      <div class="header-buttons">
        <v-btn
          variant="text"
          icon
          size="small"
          @click="showNewTabDialog"
          class="ml-2"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        
        <v-btn
          variant="text"
          icon
          size="small"
          @click="showSettings"
          class="ml-2"
        >
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </div>
    </div>

    <new-tab-dialog
      ref="newTabDialog"
      @create-text-tile="addTile"
      @create-chat-tile="addNewChatTile"
      @load-file="loadFile"
    />



    <v-window v-model="activeTab">
      <!-- Text editor tab contents -->
      <v-window-item v-for="tile in tiles" :key="`text-${tile.id}`" :value="`text-${tile.id}`">
        <rich-text-tile
          :myKey="tile.id"
          :id="tile.id"
          :initheader="tile.initheader"
          :initcontent="tile.initcontent"
          :ref="`richTextTile-${tile.id}`"
          @openSettings="showSettings"
          @newTile="addLoadedTile"
          @newHeadedTile="addLoadedTileWithHeader"
          @updateHeader="updateTileHeader"
        />
      </v-window-item>

      <!-- Chat tab contents -->
      <v-window-item v-for="tile in chatTiles" :key="`chat-${tile.id}`" :value="`chat-${tile.id}`">
        <chat-tile
          :myKey="tile.id"
          :id="tile.id"
          :initheader="tile.initheader"
          :initcontent="tile.initcontent"
          :ref="`chatTile-${tile.id}`"
          @openSettings="showSettings"
          @newChatTile="addNewChatTile"
        />
      </v-window-item>

      <!-- Media tab contents -->
      <v-window-item v-for="tile in mediaTiles" :key="`media-${tile.id}`" :value="`media-${tile.id}`">
        <video-tile
          :myKey="tile.id"
          :id="tile.id"
          :mime="tile.mime"
          :file="tile.file"
          :fileContent="tile.fileContent"
          :ref="`videoTile-${tile.id}`"
          @newTextTile="addLoadedTileWithHeader"
          @newMediaTile="loadUrl"
          @openSettings="showSettings"
        />
      </v-window-item>
    </v-window>
    <app-settings v-if="showModal" @hideSettings="hideSettings" />
<!-- 

    <div class="controls-panel">


      <media-loader />
      <universal-playback v-if="mediaTiles.length >= 1" />
    </div> -->
    </div>
</template>



<script>
import RichTextTile from './components/text/RichTextTile.vue';
import VideoTile from './components/VideoTile.vue';
// import AudioPlayer from './components/AudioPlayer.vue';
// import AppSettings from './components/AppSettings.vue';
import AppSettings from './components/AppSettings.vue';
import ChatTile from './components/text/ChatTile.vue';
import NewTabDialog from './components/NewTabDialog.vue'



export default {
  components: {
    'rich-text-tile': RichTextTile,
    'video-tile': VideoTile,
    // 'audio-player': AudioPlayer,
    // 'app-settings': AppSettings,
    'app-settings': AppSettings,
    'chat-tile' : ChatTile,
    'new-tab-dialog': NewTabDialog,

  },

  data() {
    return {
      activeTab: null,
      chatTiles: [],
      nextChatId: 1,
      tiles: [],
      nextId: 1,
      mediaTiles: [],
      nextVidId: 1,
      showModal: false,
      mediaRecorder: null,
      chunks: [],
      audio: null,
      isRecording: false
    };
  },
  methods: {
    addTile() {
      const id = Date.now();
      this.tiles.push({ id, initcontent: '' });
      this.activeTab = `text-${id}`;
    },
    addLoadedTile(content) {
      let uniqueId = Date.now();
      this.addLoadedTileWithId(uniqueId, content)
    },
    addLoadedTileWithId(id, content) {
      this.tiles.push({ id: id, initcontent: content });
      this.$nextTick(() => {
        this.$refs[`richTextTile-${id}`][0].$el.focus();
        this.$refs[`richTextTile-${id}`][0].$el.scrollIntoView({ behavior: "smooth" });
      });
    },
    addLoadedTileWithHeader(header, content) {
      let id = Date.now();
      console.log(`id: ${id}, header: ${header}, content: ${content}`)
      this.tiles.push({ id: id, initheader: header, initcontent: content });
      this.$nextTick(() => {
        this.$refs[`richTextTile-${id}`][0].$el.focus();
        this.$refs[`richTextTile-${id}`][0].$el.scrollIntoView({ behavior: "smooth" });
      });
    },
    addLoadedTileWithIdHeader(id, header, content) {
      console.log(`id: ${id}, header: ${header}, content: ${content}`)
      this.tiles.push({ id: id, initheader: header, initcontent: content });
      this.$nextTick(() => {
        this.$refs[`richTextTile-${id}`][0].$el.focus();
        this.$refs[`richTextTile-${id}`][0].$el.scrollIntoView({ behavior: "smooth" });
      });
    },
    handleClose(idToRemove) {
      this.tiles = this.tiles.filter(tile => tile.id !== idToRemove);
    },
    clickLoadFile(event) {
      this.loadFile(event.target.files[0]);
    },
    loadUrl(event) {
      fetch(event.url)
        .then(res => res.blob())
        .then(blob => {
          // Here we determine the media type for the blob
          const mediaType = blob.type;
          const fileSrc = URL.createObjectURL(blob);

          // Here we create a File object from blob
          const file = new File([blob], event.title, {
            type: mediaType,
            lastModified: Date.now()
          });

          // Checking the media type
          const mediaTypeValue = mediaType.split('/')[0];
          if (mediaTypeValue === 'video' || mediaTypeValue === 'audio' || mediaTypeValue === 'image') {
            this.addMediaTile(mediaType, fileSrc, file);
          }
        })
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
        });
    },
    loadFile(file) {
      // If file size and type are valid, create a data URL
      // and assign it to videoSrc data property
      console.log("load ile called")
      let reader = new FileReader();
      reader.onload = e => {
        const fileContent = e.target.result;
        const fileExtension = file.name.split('.').pop();

        if (['md', 'txt', 'srt', 'lrc'].includes(fileExtension)) {
          this.addLoadedTileWithHeader(file.name, fileContent); // assuming file name is used as header
        } else {
          let mediaType = file.type;
          const mediaTypeValue = mediaType.split('/')[0];
          if (mediaTypeValue == 'video' || mediaTypeValue == 'audio' || mediaTypeValue == 'image') {
            const fileSrc = URL.createObjectURL(file);
            this.addMediaTile(mediaType, fileSrc, file);
          }
        }
      };

      if (['md', 'txt', 'srt', 'lrc'].includes(file.name.split('.').pop())) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    },

    addNewChatTile(header = '', content = '') {
      const id = Date.now();
      this.chatTiles.push({ id, initheader: header, initcontent: content });
      this.activeTab = `chat-${id}`;
    },

    handleChatTileClose(idToRemove) {
      this.chatTiles = this.chatTiles.filter(tile => tile.id !== idToRemove);
    },
    addMediaTile(mediaType, fileContent, file) {
      const id = this.nextVidId++;
      this.mediaTiles.push({ id, mime: mediaType, fileContent, file });
      this.activeTab = `media-${id}`;
    },
    handleMediaClose(idToRemove) {
      this.mediaTiles = this.mediaTiles.filter(tile => tile.id !== idToRemove);
    },
    onKeydown(e) {
      if (e.altKey && (e.key === 'N' || e.key === 'n')) {
        e.preventDefault();
        this.addTile();
      }
    },
    showSettings() {
      console.log('This should open the settings!')
      this.showModal = true;
    },
    hideSettings() {
      console.log("settings config");
      this.showModal = false;
    },
    showNewTabDialog() {
      this.$refs.newTabDialog.showDialog()
    },
    updateTileHeader(id, newHeader) {
      const tile = this.tiles.find(t => t.id === id);
      if (tile) {
        tile.initheader = newHeader;
        this.id = newHeader;
      }
    },
  },
  mounted() {
    window.addEventListener('keydown', this.onKeydown);
    document.title = '[De(on]struct)';
    Object.keys(this.$store.state.pinnedItems).forEach(id => {
      const item = this.$store.state.pinnedItems[id];
      this.addLoadedTileWithIdHeader(id, item.header, item.content);
    });
    // this.addLoadedTile("Decon\n---\n\nEmbedded in the Buddhist principle that all things are ultimately empty, Decon is an open-source technological tool that draws on this fundamental understanding to dissect specifics and parse out knowledge. By breaking things apart, we gain a more profound understanding of their core functions, allowing us to improve and innovate further. \n\nHarnessing the formidable capabilities of AI, Decon is a browser-based application designed to delve deep into the essence of things. Powered by OpenAI's APIs for text and automatic speech recognition (ASR), Decon applies artificial intelligence to analyse, decipher, and interpret data. For the dissection of audio into its primary components, it utilizes the Replicate API, providing a holistic and comprehensive understanding of the constituent elements. \n\nWith Decon, the pursuit of knowledge isn't about accumulation but about reduction, bringing us one step closer to genuine understanding and ingenious discovery.\n\nHowever, with great power comes great responsibility. Through Decon, you are accessing one of the most potent tools humans have ever created. Therefore, we urge you to utilize this resource with care, respect, and good intentions, always striving for the betterment of all beings.\n\n#### Translation in Hinglish\n\n")
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.keydownHandler);
  },
  errorCaptured(error) {
    if (error.response && error.response.data && error.response.data.error) {
      alert(`An error has occurred: ${error.response.data.error.message}`)
    } else {
      alert(`An error has occurred: ${error.message}`)
    }
    return false;
  },
}
</script>


<style>

.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.v-window {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.controls-panel {
  padding: 10px;
  border-top: 1px solid #ccc;
  background-color: #f5f5f5;
}

.file-controls {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.file-label {
  background-color: #e0e0e0;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

#file {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

/* Dark mode styles */
.dark-mode .v-tabs {
  background-color: var(--dark);
}

.dark-mode .v-tab {
  color: var(--white);
}

.dark-mode .controls-panel {
  background-color: var(--semi-dark);
  border-color: var(--gray);
}

.dark-mode .file-label {
  background-color: var(--dark);
  color: var(--white);
}

.new-tab-button {
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-right: 48px;
}


/* Dark mode styles for the new button */
.dark-mode .new-tab-button .v-btn {
  color: var(--white);
}

.dark-mode .new-tab-button .v-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.settings-button {
  display: flex;
  align-items: center;
  padding-right: 16px;
}

.settings-button .v-btn {
  border-radius: 4px;
}

/* Dark mode styles for the settings button */
.dark-mode .settings-button .v-btn {
  color: var(--white);
}

.dark-mode .settings-button .v-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}



.header-container {
  position: relative;
  display: flex;
  align-items: center;
  background-color: primary;
}

.v-tabs {
  flex-grow: 1;
  padding-right: 100px; /* Make space for the buttons */
}

.header-buttons {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0 px;
  z-index: 1;
}

.dark-mode .header-buttons .v-btn {
  color: var(--white) !important;
}

.dark-mode .header-buttons .v-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .header-buttons .v-icon {
  color: var(--white) !important;
}

.tab-item {
  position: relative;
  padding-right: 18px !important;
  padding-left: 6px !important;
}

.tab-label {
  margin-right: 4px;
}

.tab-close {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 22px; /* Increased from 16px to 22px */
  font-weight: bold; /* Makes the X bolder */
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 0;
  transition: all 0.2s ease;
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.3); /* Subtle glow in light mode */
}

.tab-close:hover {
  background-color: rgba(0, 0, 0, 0.1);
  transform: translateY(-50%) scale(1.1); /* Slight grow effect on hover */
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.5); /* Enhanced glow on hover */
}

/* Dark mode styles */
.dark-mode .tab-close {
  color: var(--white);
  text-shadow: 0 0 1px rgba(255, 255, 255, 0.3); /* Subtle glow in dark mode */
}

.dark-mode .tab-close:hover {
  background-color: rgba(255, 255, 255, 0.1);
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.5); /* Enhanced glow on hover in dark mode */
}
</style>

