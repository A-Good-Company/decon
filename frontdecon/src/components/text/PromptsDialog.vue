<template>
    <div>
        <v-dialog v-model="openPromptsDialog" persistent max-width="500px">
            <v-card>
                <v-card-title>Prompts</v-card-title>
                <v-card-text>
                    <v-row v-for="id in Object.keys($store.state.prompts)" :key="id">
                        <v-col cols="auto">
                            <div>{{ id }}</div>
                            <div class="subtitle"  style="font-size: 0.8em;">{{ $store.state.prompts[id].content.slice(0, 40) + '...' }}</div>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="auto">
                            <v-btn class="mx-1 my-1" flat size="small" color="primary"
                                @click="runPrompt(id)">Run</v-btn>
                            <v-btn class="mx-1 my-1" flat size="small" color="secondary"
                                @click="editPrompt(id)">Edit</v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="openPromptsDialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    name: 'PromptComponent',
    props: ['openPromptsDialog'],
    methods: {
        runPrompt(id) {
            this.$emit('runPrompt', id);
            this.$emit('toggleDialog', false);
        },
        editPrompt(id) {
            this.$emit('editPrompt', id);
            this.$emit('toggleDialog', false);
        },
    },
}
</script>