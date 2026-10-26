<template>
    <div class="space-y-6"
        :class="full ? 'max-w-none' : (wide ? 'max-w-6xl' : 'max-w-3xl')">

        <!-- Lien de retour vers la liste (fiches de l'admin) -->
        <div class="-mb-3 text-sm"
            v-if="$slots.back">
            <slot name="back"></slot>
        </div>

        <header class="flex flex-col sm:flex-row sm:items-end gap-4">
            <div class="flex-grow min-w-0 flex items-center gap-4">
                <!-- Logo, avatar -->
                <div class="shrink-0"
                    v-if="$slots.leading">
                    <slot name="leading"></slot>
                </div>
                <div class="min-w-0 space-y-1">
                    <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
                            {{ title }}
                        </h1>
                        <!-- Étiquettes d'état à côté du titre -->
                        <slot name="badges"></slot>
                    </div>
                    <p class="text-slate-500 dark:text-slate-400"
                        v-if="$slots.description">
                        <slot name="description"></slot>
                    </p>
                </div>
            </div>
            <div class="flex flex-wrap items-center gap-2 shrink-0"
                v-if="$slots.actions">
                <slot name="actions"></slot>
            </div>
        </header>

        <slot></slot>

    </div>
</template>

<script>
    import { defineComponent } from 'vue'
    export default defineComponent({
        props: {
            title: {
                type: String,
                required: true,
            },
            // Pages à tableau : plus de place que pour un formulaire
            wide: {
                type: Boolean,
                default: false,
            },
            // Pages d'outil qui occupent toute la largeur
            full: {
                type: Boolean,
                default: false,
            },
        },
    })
</script>
