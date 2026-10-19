<template>
    <div>
        
        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <!-- Header -->
        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <div :class="headerClasses"
            role="button"
            tabindex="0"
            :aria-expanded="item"
            @click="toggle"
            @keydown.enter.self.prevent="toggle"
            @keydown.space.self.prevent="toggle">
            <div class="shrink-0 transform origin-center transition-transform text-slate-400"
                :class="{
                    'rotate-90': item,
                }">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
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
                default: 'px-4 py-2.5 flex items-center gap-2 cursor-pointer select-none bg-slate-50 hover:bg-slate-100 text-sm font-bold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-300 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:text-white dark:focus-visible:ring-primary-700',
            },
            contentClasses: {
                required: false,
                default: 'px-4 py-3 border-t border-slate-200 dark:border-slate-700',
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
