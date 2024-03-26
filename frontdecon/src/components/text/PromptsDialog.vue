<template>
    <div class="prompts-dialog">
      <div v-for="(prompt, index) in prompts" :key="index">
        <h3>{{prompt.id}}</h3> 
        <p>{{prompt.content}}</p>
        <v-btn class="mx-1 my-1" flat size="small" @click="editPrompt(prompt.id)">Edait</v-btn>
        <v-btn class="mx-1 my-1" flat size="small" @click="runPrompt(prompt)">Run</v-btn>
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