<template>
    <div class="texttile">
        <base-tile :id="id">
            <template v-slot:content>
                <textarea v-model="text" @input="updateContent"></textarea>
            </template>
        </base-tile>
    </div>
</template>



<script>
import BaseTile from '../components/BaseTile.vue';


export default {
    components: {
        'base-tile': BaseTile
    },
    extends: BaseTile,
    data() {
        return {
            content: 'this is not',
            text: 'Editable text'
        };
    },
    methods: {
        updateContent() {
            this.content = this.text;
        }
    }
};

</script>

<style scoped>

</style>