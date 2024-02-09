<template>
    <div>
      <input type="file" @change="handleFileUpload">
      <video class="media-loader-video" v-if="mediaType === 'video'" controls>
        <source :src="fileSrc" type="video/mp4">
      </video>
      <audio class="media-loader-audio" v-if="mediaType === 'audio'" controls>
          <source :src="fileSrc" type="audio/mpeg">
      </audio>
    </div>
  </template>


  <script>
  export default {
    data() {
      return {
        fileSrc: null,
        mediaType: null
      }
    },
    methods: {
      handleFileUpload(event) {
        const file = event.target.files[0];
        if (this.isFileSizeValid(file.size) && this.isFileTypeValid(file.type)) {
          // If file size and type are valid, create a data URL
          // and assign it to videoSrc data property
          let reader = new FileReader();
          reader.onload = e => {
            this.fileSrc = e.target.result;
            this.setMediaType(file.type);
          };
          reader.readAsDataURL(file);
        } else {
          // Handle invalid file size or type
        }
      },
      isFileSizeValid(fileSize) {
        // Validate the file size
        console.log("Size");
        console.log(fileSize);
        return true;
      },
      isFileTypeValid(fileType) {
        // Validate the file type
        console.log("Type");
        console.log(fileType);
        return true;
      },
      setMediaType(fileType){
        if(fileType.indexOf("audio") !== -1){
            this.mediaType = "audio";  
          }
        if(fileType.indexOf("video") !== -1){
        this.mediaType = "video";  
        }
      }
    }
  }
  </script>


