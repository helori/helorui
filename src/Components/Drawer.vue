<template>

    <div v-if="opened" class="fixed z-40 w-full h-full inset-0 bg-black/70" @click="close"></div>

    <div class="fixed z-50 inset-y-0 w-full lg:w-4/5 flex flex-col transition-all bg-white dark:bg-gray-800"
        :class="{
            'left-full': !opened,
            'left-0 lg:left-[20%]': opened,
            'pr-12': hasClose,
        }">

        <div v-if="hasClose" class="absolute top-0 right-0 w-12 h-12 bg-gray-200 cursor-pointer"
            @click="close">
        </div>

        <div v-if="hasSlot('header')" class="py-4 px-8 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-600">
            <slot name="header"></slot>
        </div>

        <div v-if="hasSlot('content')" class="flex-grow overflow-y-scroll" :class="contentClasses">
            <slot name="content"></slot>
        </div>

        <div v-if="hasSlot('footer')" class="py-4 px-8 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-600">
            <slot name="footer"></slot>
        </div>

    </div>
</template>

<script>
    import { defineComponent, ref } from 'vue'

    export default defineComponent({

        props: {
            hasClose: {
                type: Boolean,
                default: true,
                required: false,
            },
            contentClasses: {
                default: 'py-4 px-8'
            }
        },

        setup(props, {slots})
        {
            const opened = ref(false);

            function open()
            {
                opened.value = true;
            }

            function close()
            {
                opened.value = false;
            }

            function toggle()
            {
                opened.value = !opened.value;
            }

            const hasSlot = name => !!slots[name]

            return {
                opened,
                open,
                close,
                toggle,
                hasSlot,
            }
        }
    })
</script>
