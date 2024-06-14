<template>
    <v-card class="chat-tile mx-1 my-1" :variant="tileVariant" :color="tileColor">
        <v-card-title class="headline">
            <h4><input type="text" v-model="header" class="tile-header" @focus="selectAll" /></h4>
        </v-card-title>
        <v-card-text>
            <div class="chat-history">
                <div v-for="(msg, index) in chatHistory" :key="index" :class="`message ${msg.sender}`">
                    <div class="message-content" v-html="formatMessage(msg.content)"></div>
                </div>
            </div>
            <div class="send-message">
                <input type="text" v-model="newMessage" class="message-input" placeholder="Type your message here..."
                    @keyup.enter="sendMessage">
                <v-btn color="primary" flat class="send-button" @click="sendMessage">Send</v-btn>
            </div>
            <div class="upload-image">
                <input type="file" accept="image/*" @change="uploadImage" multiple class="image-input">
                <v-btn color="primary" flat class="query-image" @click="queryUserImage">Query Image</v-btn>
            </div>
            <div class="uploaded-images">
                <div v-for="(image, index) in uploadedImages" :key="index" class="image-container">
                    <img :src="image.src" alt="" class="small-image">
                    <v-btn small icon color="red" class="delete-button" @click.stop="deleteImage(index)">x</v-btn>
                </div>
            </div>
            <image-preview v-if="previewImage" :src="previewImage" @close="closePreview"></image-preview>
        </v-card-text>
    </v-card>
</template>

<script>
import openai from '@/utils/openai'
import ImagePreview from '../image/ImagePreview.vue';



export default {
    props: ['id', 'myKey', 'initheader'],
    components: { ImagePreview },

    data() {
        return {
            header: this.initheader || 'Chat Room',
            chatHistory: [],
            newMessage: '',
            tileColor: 'default',
            tileVariant: 'outlined',
            uploadedImages: [],
            previewImage: null,
        };
    }, methods: {
        async sendMessage() {
            if (this.newMessage.trim()) {
                this.chatHistory.push({
                    sender: 'user',
                    content: this.newMessage.trim()
                });

                this.newMessage = '';

                const aiResponse = await openai.generateChat(this.chatHistory.map(msg => msg.content));
                this.chatHistory.push({
                    sender: 'ai',
                    content: aiResponse
                });
            }
        },
        selectAll(event) {
            event.target.select();
        },
        uploadImage(event) {
            const files = event.target.files;
            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();

                reader.onloadend = () => {
                    this.uploadedImages.push({
                        src: reader.result,
                    });
                };

                reader.readAsDataURL(files[i]);
            }
        },
        deleteImage(index) {
            this.uploadedImages.splice(index, 1);
        },
        showPreview(index) {
            this.previewImage = this.uploadedImages[index].src;
        },
        closePreview() {
            this.previewImage = null;
        },
        async queryUserImage() {
            if (this.newMessage.trim() && this.uploadedImages.length > 0) {
                const image = this.uploadedImages[this.uploadedImages.length - 1]; // get latest image
                const textContent = this.newMessage.trim();
                this.newMessage = '';
                this.chatHistory.push({
                    sender: 'user',
                    content: textContent.trim()
                });
                const aiResponse = await openai.queryImage(image.src, textContent);
                this.chatHistory.push({
                    sender: 'ai',
                    content: aiResponse
                });
            } else {
                console.log("Please enter text and upload the image before query!");
            }
        },
        formatMessage(message) {
            return message.replace(/\n/g, '<br/>');
        },
    },
    computed: {
        isEditorReadOnly: function () {
            return this.lockContentUpdates;
        }
    },
    watch: {
        chatHistory(newChatHistory) {
            console.log(newChatHistory);
        }
    }
};
</script>


<style scoped>
.send-message {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-history {
    max-height: 350px;
    overflow-y: auto;
    margin-bottom: 20px;
    border: 1px solid #E0E0E0;
    padding: 10px;
    box-sizing: border-box;
}

.message {
    margin-bottom: 10px;
}

.message.user .message-content {
    background-color: #3181F7;
    color: white;
    padding: 10px;
    border-radius: 5px;
}

.message.ai .message-content {
    background-color: #3CB371;
    color: white;
    padding: 10px;
    border-radius: 5px;
}

.image-container {
    position: relative;
    display: inline-block;
    margin: 10px;
    height: 200px;
    object-fit: contain;

}

.small-image {
    height: 100%;
    width: auto;
}

.delete-button {
    position: absolute;
    top: 0px;
    right: 0px;
    background: white;
    border-radius: 50%;
}
</style>