<template>
    <div class="rich-text-tile">
        <h3>Tile #{{ this.myKey }}</h3>
        <rich-text-editor/>
        <button class="closeButton" @click="close">Close</button>
        <button @click="process">Process</button>
        <button @click="move">Move</button>
    </div>
</template>

<style scoped>
</style>

<script>
import RichTextEditor from './RichTextEditor.vue';

export default {
    components: {
        'rich-text-editor' : RichTextEditor
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
button{
padding: 2px;
border-radius: 10%; 
padding-right: 4px;
background-color: rgb(124, 204, 104); 
color: white; 
}
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

