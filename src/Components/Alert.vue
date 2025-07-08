<template>
    <div :class="allClasses">
        <slot></slot>
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
                default: 'py-2 px-4 rounded-md font-medium border',
            },
        },

        setup(props)
        {
            const allClasses = computed(() => {
                let typeClasses = '';
                if(props.type === 'primary') { typeClasses = 'bg-primary-100 border-primary-500 text-primary-700 dark:bg-primary-900 dark:border-primary-300 dark:text-primary-200'; }
                else if(props.type === 'success') { typeClasses = 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:border-green-300 dark:text-green-200'; }
                else if(props.type === 'warning') { typeClasses = 'bg-yellow-100 border-yellow-500 text-yellow-700 dark:bg-yellow-900 dark:border-yellow-300 dark:text-yellow-200'; }
                else if(props.type === 'danger') { typeClasses = 'bg-red-100 border-red-600 text-red-800 dark:bg-red-900 dark:border-red-300 dark:text-red-200'; }
                else if(props.type === 'info') { typeClasses = 'bg-blue-100 border-primary-500 text-blue-700 dark:bg-blue-900 dark:border-blue-300 dark:text-blue-200'; }
                return props.classes + ' ' + typeClasses;
            })

            return {
                allClasses
            }
        }
    })
</script>
