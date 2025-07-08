<template>
    <div>
        <div class="flex items-center gap-2 cursor-pointer"
            :class="headerClasses"
            @click="toggle">
            <div class="shrink-0">
                <svg class="transition-all size-6" :class="open ? 'rotate-90' : ''" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </div>
            <div class="flex-grow">
                <slot name="header"></slot>
            </div>
        </div>

        <div :class="contentClasses"
            v-show="open">
            <slot name="content" />
            <div v-if="!$slots.content"
                class="text-xs text-gray-500 italic">
                {{ $t('Empty') }}
            </div>
        </div>
    </div>
</template>

<script>
    import { defineComponent, ref } from 'vue'

    export default defineComponent({
        props: {
            headerClasses: {
                required: false,
                default: '',
            },
            contentClasses: {
                required: false,
                default: ['px-2, py-2'],
            },
            disabled: {
                type: Boolean,
                default: false,
                required: false,
            },
        },

        setup(props, { slots })
        {
            const open = ref(false);

            function toggle()
            {
                if(!props.disabled){
                    open.value = !open.value;
                }
            }

            return {
                open,
                toggle,
            }
        }
    })
</script>
