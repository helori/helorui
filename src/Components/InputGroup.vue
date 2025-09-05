<template>
    <div class="flex w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black">
        <div v-if="prefix" 
            class="whitespace-nowrap pl-3 pr-1 py-2 rounded-l-md"
            :class="prefixClasses">
            {{ prefix }}
        </div>
        <slot name="input"></slot>
        <div v-if="unit"
            class="px-2 py-2 whitespace-nowrap rounded-r-md">
            {{ unit }}
        </div>
        <div v-if="suffix"
            class="whitespace-nowrap px-3 py-2 rounded-r-md bg-gray-100 dark:bg-gray-800 border-l border-gray-300 dark:border-gray-600">
            {{ suffix }}
        </div>
        <slot name="button"></slot>
    </div>
</template>

<script>
    import { defineComponent } from 'vue'
    export default defineComponent({
        props: {
            prefix: {
                type: String,
                required: false,
                default: ''
            },
            suffix: {
                type: String,
                required: false,
                default: ''
            },
            unit: {
                type: String,
                required: false,
                default: ''
            },
            prefixClasses: {
                required: false,
                default: ''
            },
        },
    })
</script>
