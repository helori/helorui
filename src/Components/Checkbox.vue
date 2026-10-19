<template>
    <span class="shrink-0 size-4 rounded border flex items-center justify-center transition-colors"
        :class="checked
            ? 'bg-primary-600 border-primary-600 text-white dark:bg-primary-400 dark:border-primary-400 dark:text-slate-900'
            : 'bg-white border-slate-300 dark:bg-slate-800 dark:border-slate-600'"
        aria-hidden="true">
        <svg v-show="checked" class="size-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    </span>
</template>

<script>

import { defineComponent } from 'vue'

export default defineComponent(
{
    props: {
        checked: {
            type: Boolean,
            required: true
        },
    },
})
</script>
