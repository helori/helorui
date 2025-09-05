<template>
    <div class="flex w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
        <div v-if="prefix" 
            class="whitespace-nowrap pl-2 py-2 rounded-l-md text-gray-500 dark:text-gray-200"
            :class="prefixClasses">
            {{ prefix }}
        </div>
        <slot name="input"></slot>
        <div v-if="unit"
            class="px-2 py-2 whitespace-nowrap rounded-r-md">
            {{ unit }}
        </div>
        <div v-if="suffix"
            class="whitespace-nowrap pr-2 py-2 rounded-r-md text-gray-500 dark:text-gray-200">
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
