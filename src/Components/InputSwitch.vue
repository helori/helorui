<template>
    <button
        type="button"
        role="switch"
        :id="id"
        :aria-checked="modelValue ? 'true' : 'false'"
        :aria-label="label || null"
        :disabled="disabled"
        class="relative inline-flex shrink-0 h-6 w-11 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="modelValue ? 'bg-primary-600 dark:bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'"
        @click="$emit('update:modelValue', !modelValue)">
        <span
            aria-hidden="true"
            class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform duration-200"
            :class="modelValue ? 'translate-x-5' : 'translate-x-0'">
        </span>
    </button>
</template>

<script>
    import { defineComponent } from 'vue'

    export default defineComponent({
        props: {
            modelValue: {
                type: Boolean,
                default: false,
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            id: {
                type: String,
                default: null,
            },
            // Libellé lu par les lecteurs d'écran quand aucun <label for> ne pointe sur l'interrupteur
            label: {
                type: String,
                default: '',
            },
        },
        emits: ['update:modelValue'],
    })
</script>
