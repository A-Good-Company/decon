<template>
    <div class="prompts-dialog">
      <div v-for="(prompt, index) in prompts" :key="index">
        <h3>{{prompt.id}}</h3> 
        <p>{{prompt.content}}</p>
        <button @click="editPrompt(prompt.id)">Edit</button>
        <button @click="runPrompt(prompt)">Run</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['prompts'],
    methods: {
      editPrompt(promptId) {
        this.$emit('editPrompt', promptId);
      },
      runPrompt(prompt) {
        this.$emit('runPrompt', prompt);
      },
    },
  };
  </script>
  
  <style scoped>
  /* add styles here for prompts dialog */
  </style>