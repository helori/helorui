<template>
    <div>
        
        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <!-- Header -->
        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <div :class="headerClasses"
            @click="toggle">
            <div class="transform origin-center transition"
                :class="{
                    'rotate-90': item,
                }">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="h-4 w-4">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </div>
            <slot name="header"></slot>
        </div>

        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <!-- Content -->
        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <div :class="contentClasses"
            v-show="item">
            <slot name="content"></slot>
        </div>

    </div>
</template>

<script>
    import { defineComponent, ref, watch } from 'vue'

    export default defineComponent({

        emits: [
            'update:opened',
            'closed',
            'opened',
        ],

        props: {
            opened: {
                type: Boolean,
                required: false,
                default: false,
            },
            headerClasses: {
                required: false,
                default: '-mt-px px-4 py-2 flex items-center gap-2 cursor-pointer bg-gray-300 hover:bg-gray-200 border-t border-b border-gray-400 text-sm font-semibold dark:bg-gray-900 dark:border-gray-900 dark:text-white',
            },
            contentClasses: {
                required: false,
                default: 'px-4 py-3 bg-gray-100 dark:bg-gray-600',
            },
        },

        setup(props, { emit })
        {
            const item = ref(props.opened);
            
            function toggle()
            {
                setOpened(!item.value);
            }
            
            watch(() => props.opened, opened => {
                setOpened(opened);
            })

            function setOpened(opened)
            {
                if(item.value !== opened)
                {
                    item.value = opened;
                    emit('update:opened', item.value);
                    emit(item.value ? 'opened' : 'closed', item.value);
                }
            }

            return {
                item,
                toggle,
            };
        }
    })
</script>
