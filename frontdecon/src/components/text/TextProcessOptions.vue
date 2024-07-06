<template>
    <div class="process-options">
        <button @click="option1">Generate Text</button>
        <button @click="option2">Option 2</button>
        <button @click="option3">Option 3</button>
    </div>
</template>

<script>

export default {
    components: {
    },
    methods: {
        option1() {
            this.$emit('generateText');
        },
        option2() {
            // Process option 2
            this.$emit('focus')
        },
        option3() {
            // Process option 3
        }
    }
}
</script>

<style scoped>
button {
    padding: 2px;
    border-radius: 10%; 
    background-color: rgb(124, 204, 104); 
    color: white; 
    margin-right: 10px;
}
</style>