<template>
    <div class="flex items-stretch w-full rounded-md border border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 shadow-sm">
        <div v-if="prefix"
            class="flex items-center whitespace-nowrap pl-3 rounded-l-md text-slate-500 dark:text-slate-400"
            :class="prefixClasses">
            {{ prefix }}
        </div>
        <slot name="input"></slot>
        <div v-if="unit"
            class="flex items-center px-3 whitespace-nowrap rounded-r-md text-slate-500 dark:text-slate-400">
            {{ unit }}
        </div>
        <div v-if="suffix"
            class="flex items-center whitespace-nowrap pr-3 rounded-r-md text-slate-500 dark:text-slate-400">
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
