<template>
    <div class="video-tile">
        <h3>Tile #{{ this.myKey }}</h3>
        <media-loader/>
        <button class="closeButton" @click="close">Close</button>
        <button @click="process">Process</button>
        <button @click="move">Move</button>
    </div>
</template>

<style scoped>
</style>

<script>
import MediaLoader from './MediaLoader.vue';
export default {
    components: {
        'media-loader' :MediaLoader
    },

    props : ['id', 'myKey'],
    data() {
        return {
            interval: null,
            content: "Test message"
        };
    },
    methods: {
        close() {
            this.$emit('close', this.myKey);
        },
        process() {

        },
        move() {

        },       
    },
};
</script>


<style scoped>
.closeButton{
padding: 2px;
border-radius: 10%; 
padding-right: 4px;
background-color: blue; 
color: white; 
}
.closeButton:hover{
background-color: darkblue;
}

h3{
font-weight: bold;
font-size: 2em;
}


.timer {
}
</style>

