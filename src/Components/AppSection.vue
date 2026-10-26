<template>
    <section class="-mx-4 sm:mx-0 sm:rounded-xl border-y sm:border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">

        <div class="px-4 sm:px-6 pt-5 flex flex-wrap items-start justify-between gap-3"
            v-if="title || $slots.description || $slots.actions">
            <div class="min-w-0">
                <h2 class="font-bold text-slate-900 dark:text-white"
                    v-if="title">
                    {{ title }}
                </h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400"
                    v-if="$slots.description">
                    <slot name="description"></slot>
                </p>
            </div>
            <!-- Réglages de l'affichage de la section (période…) -->
            <div class="shrink-0"
                v-if="$slots.actions">
                <slot name="actions"></slot>
            </div>
        </div>

        <div class="px-4 sm:px-6 py-5 space-y-5">
            <slot></slot>
        </div>

        <!-- Actions de la section : alignées à droite, sur un bandeau discret -->
        <div class="px-4 sm:px-6 py-3 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
            v-if="$slots.footer">
            <slot name="footer"></slot>
        </div>

    </section>
</template>

<script>
    import { defineComponent } from 'vue'
    export default defineComponent({
        props: {
            title: {
                type: String,
                default: '',
            },
        },
    })
</script>
