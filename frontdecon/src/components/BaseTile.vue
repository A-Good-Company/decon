<template>
    <div class="base-tile">
        <h3>Tile #{{ this.myKey }}</h3>
        <p>{{ content }}</p>
        <button @click="close">Close</button>
        <button @click="process">Process</button>
        <button @click="move">Move</button>
    </div>
</template>



<script>
export default {
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
.timer {
    /* .. */
}
</style>

