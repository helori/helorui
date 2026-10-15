<template>
    <div class="flex items-start gap-3" :class="allClasses" role="alert">
        <svg v-if="iconPath" class="w-[1.25em] h-[1.25em] shrink-0 mt-px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" :d="iconPath" clip-rule="evenodd" />
        </svg>
        <div class="min-w-0 flex-grow">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import { defineComponent, computed } from 'vue'

    export default defineComponent({
        props: {
            type: {
                type: String,
                required: true,
            },
            classes: {
                type: String,
                required: false,
                default: 'px-4 py-3 rounded-lg border text-sm font-medium',
            },
        },

        setup(props)
        {
            const TYPES = {
                primary: 'bg-primary-50 border-primary-200 text-primary-800 dark:bg-primary-950 dark:border-primary-800 dark:text-primary-200',
                info: 'bg-primary-50 border-primary-200 text-primary-800 dark:bg-primary-950 dark:border-primary-800 dark:text-primary-200',
                success: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200',
                warning: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200',
                danger: 'bg-red-100 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-800 dark:text-red-100',
            };

            // Icônes Heroicons (solid, 20px)
            const ICONS = {
                primary: 'M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z',
                info: 'M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z',
                success: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z',
                warning: 'M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
                danger: 'M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
            };

            const allClasses = computed(() => {
                return props.classes + ' ' + (TYPES[props.type] ?? '');
            })

            const iconPath = computed(() => ICONS[props.type] ?? null);

            return {
                allClasses,
                iconPath,
            }
        }
    })
</script>
