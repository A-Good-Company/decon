<template>
    <div class="basetile">
        <h3>Tile #{{ id }}</h3>
        <p>{{ content }}</p>
        <button @click="close">Close</button>
        <button @click="process">Process</button>
        <button @click="move">Move</button>
    </div>
</template>


<script>
export default {
    props : ['id'],
    data() {
        return {
            interval: null
        };
    },
    methods: {
        close() {

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