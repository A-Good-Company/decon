```vue
<template>
    <button :class="buttonClass" @click="$emit('clickButton')">
        <slot/> <!-- this is where the button name will be injected -->
    </button>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: '', // allowed values: 'default', 'close'
        },
    },
    computed: {
        buttonClass() {
            return {
                'default-button bg-purple-200 text-purple-800 text-sm rounded min-h-[32px] px-3 py-0.5 font-semibold hover:bg-purple-400 m-1': this.type === 'default',
                'close-button bg-pink-200 text-pink-800 text-sm rounded min-h-[32px] px-3 py-0.5 font-semibold hover:bg-pink-400 m-1': this.type === 'close',
                'new-button bg-gray-200 text-gray-900 text-l rounded-md min-h-[32px] px-3 py-0.5 font-semibold hover:bg-gray-400 m-1 w-2/4': this.type === 'new',
                'message-button bg-transparent text-gray-400 text-sm rounded min-h-[32px] px-3 py-0.5 font-semibold hover:bg-gray-200 m-1 border border-grey-500 italic': this.type === 'message',
            };
        },
    },
};
</script>

<style scoped>
    .default-button {
        
    }

    .close-button {
    }

    .close-button:hover {
    }
</style>
```