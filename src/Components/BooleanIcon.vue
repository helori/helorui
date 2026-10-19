<template>
    <div class="flex items-center gap-2">
        <div class="shrink-0">
            <svg v-if="value === true" class="size-5 text-emerald-600 dark:text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

            <svg v-else-if="value === false" class="size-5 text-slate-400 dark:text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

            <svg v-else-if="value === null" class="size-5 text-slate-300 dark:text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        </div>
        <div :class="value === true ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'">
            {{ label }}
        </div>
    </div>
</template>

<script>
    import { defineComponent } from 'vue'

    // Oui / non / inconnu. Un « non » n'est pas une erreur : gris, pas rouge (le rouge est réservé au danger)
    export default defineComponent({
        props: {
            value: {
                required: true,
            },
            label: {
                type: String,
                required: false,
                default: "",
            },
        },
    })
</script>
