<template>
    <!-- Les filets entre tuiles sont le fond de la grille, visible dans l'écart d'un pixel -->
    <div class="-mx-4 sm:mx-0 grid gap-px sm:rounded-xl border-y sm:border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-700 shadow-sm overflow-hidden"
        :class="columnsClass">
        <div class="px-4 sm:px-5 py-4 bg-white dark:bg-slate-900"
            v-for="item in items"
            :key="item.label">
            <div class="text-sm text-slate-500 dark:text-slate-400">{{ item.label }}</div>
            <div class="mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-white whitespace-nowrap">
                {{ item.value }}<span class="ml-1 text-base font-medium text-slate-400 dark:text-slate-500" v-if="item.suffix">{{ item.suffix }}</span>
            </div>
            <div class="mt-0.5 text-xs text-slate-500 dark:text-slate-400"
                v-if="item.sub">
                {{ item.sub }}
            </div>
        </div>
    </div>
</template>

<script>
    import { defineComponent, computed } from 'vue'

    /**
     * Rangée de chiffres clés : libellé gris, chiffre en grand, suffixe discret (« / mois », « / 4 »)
     * et détail optionnel. items = [{ label, value, suffix?, sub? }]
     */
    export default defineComponent({
        props: {
            items: {
                type: Array,
                required: true,
            },
        },
        setup(props)
        {
            // Classes écrites en entier pour être générées par Tailwind
            const COLUMNS = {
                2: 'grid-cols-2',
                3: 'grid-cols-2 sm:grid-cols-3',
                4: 'grid-cols-2 lg:grid-cols-4',
                5: 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-5',
                6: 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-6',
            };
            const columnsClass = computed(() => COLUMNS[props.items.length] ?? COLUMNS[4]);

            return {
                columnsClass,
            };
        },
    })
</script>
