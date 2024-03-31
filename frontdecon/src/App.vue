<template>

  <div class="app">
    <div class="tiles-grid richTextTile">
      <rich-text-tile v-for="tile in tiles" :key="tile.id" :myKey="tile.id" :id="tile.id" :initheader="tile.initheader"
        :initcontent="tile.initcontent" :ref="`richTextTile-${tile.id}`" @close="handleClose" @openSettings="showSettings"
        @newTile="addLoadedTile" @newHeadedTile="addLoadedTileWithHeader" />
    </div>
    <div class="vid-tiles-grid mediaTile">
      <video-tile v-for="(tile, index) in mediaTiles" :key="tile.id" :myKey="tile.id" :id="index + 1" :mime="tile.mime"
        :file="tile.file" :fileContent="tile.fileContent" :ref="`videoTile-${tile.id}`" @close="handleMediaClose"
        @newTextTile="addLoadedTileWithHeader" @newMediaTile="loadUrl" @openSettings="showSettings" />
    </div>
    <media-loader />
    <input @change="clickLoadFile" type="file" id="file">
    <label
      class="bg-gray-200 text-gray-900 text-l rounded-md min-h-[32px] px-3 py-0.5 font-semibold hover:bg-gray-400 m-1 w-2/4  flex justify-center items-center filelabel"
      for="file">Load file</label>

    <themed-button type="new" @clickButton="addTile">New Text Tile</themed-button>
    <media-recorder @audioFile="loadFile" />
    <!-- <app-settings v-if="showModal" @closeModal="showModal = false" @applySettings="saveSettings" /> -->
    <themed-button type="new" @clickButton="showSettings">Settings</themed-button>
    <app-settings v-if="showModal" @hideSettings="hideSettings"/>
    <universal-playback v-if="mediaTiles.length >= 1" />
  </div>
</template>



<script>
import RichTextTile from './components/text/RichTextTile.vue';
import VideoTile from './components/VideoTile.vue';
// import AudioPlayer from './components/AudioPlayer.vue';
import UniversalPlayback from './components/UniversalPlayback.vue';
import ThemedButton from './components/items/ThemedButton.vue';
// import AppSettings from './components/AppSettings.vue';
import MediaRecorder from './components/MediaRecorder.vue';
import AppSettings from './components/AppSettings.vue';

export default {
  components: {
    'rich-text-tile': RichTextTile,
    'video-tile': VideoTile,
    // 'audio-player': AudioPlayer,
    'universal-playback': UniversalPlayback,
    'themed-button': ThemedButton,
    // 'app-settings': AppSettings,
    'media-recorder': MediaRecorder,
    'app-settings': AppSettings
  },

  data() {
    return {
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
      this.addLoadedTile('');
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
    addMediaTile(mediaType, fileContent, file) {
      this.mediaTiles.push({ id: this.nextVidId++, mime: mediaType, fileContent: fileContent, file: file });
      this.$nextTick(() => {
        this.$refs[`videoTile-${this.nextVidId - 1}`][0].$el.focus();
        this.$refs[`videoTile-${this.nextVidId - 1}`][0].$el.scrollIntoView({ behavior: "smooth" });
      });
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
}
</script>


<style>

body {
  background-color: #bed9d8; 
}

.richTextTile {
  width: 100%;
  background-color: white;
}

.mediaTile {
  width: 100%;
}

button {
  padding: 2px;
  border-radius: 10%;
  padding-right: 4px;
  background-color: rgb(124, 204, 104);
  color: rgb(201, 81, 81);
}

.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 50px;

}


#file {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
</style>