<template>

    <!-- Voile flou, comme les popups -->
    <transition
        enter-active-class="transition-opacity ease-out duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity ease-in duration-150"
        leave-to-class="opacity-0">
        <div v-if="opened" class="fixed z-40 inset-0 bg-slate-900/50 backdrop-blur-sm" @click="close"></div>
    </transition>

    <div class="fixed z-50 inset-y-0 w-full lg:w-4/5 flex flex-col transition-all duration-200 bg-white shadow-xl dark:bg-slate-900"
        :class="{
            'left-full': !opened,
            'left-0 lg:left-[20%]': opened,
        }"
        role="dialog"
        aria-modal="true">

        <button v-if="hasClose"
            type="button"
            class="absolute top-3 right-3 z-10 p-1.5 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
            :title="$t('Close')"
            @click="close">
            <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>

        <div v-if="hasSlot('header')" class="py-4 px-6 sm:px-8 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
            :class="{ 'pr-14': hasClose }">
            <slot name="header"></slot>
        </div>

        <div v-if="hasSlot('content')" class="flex-grow overflow-y-auto" :class="[contentClasses, { 'pr-12': hasClose && !hasSlot('header') }]">
            <slot name="content"></slot>
        </div>

        <!-- Pied gris clair qui porte les boutons, comme les popups -->
        <div v-if="hasSlot('footer')" class="py-3 px-6 sm:px-8 border-t border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
            <slot name="footer"></slot>
        </div>

    </div>
</template>

<script>
    import { defineComponent, onMounted, onUnmounted, ref } from 'vue'

    export default defineComponent({

        props: {
            hasClose: {
                type: Boolean,
                default: true,
                required: false,
            },
            contentClasses: {
                default: 'py-4 px-6 sm:px-8'
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

            const closeOnEscape = (e) => {
                if(opened.value && e.key === 'Escape'){
                    close();
                }
            };

            onMounted(() => document.addEventListener('keydown', closeOnEscape));
            onUnmounted(() => document.removeEventListener('keydown', closeOnEscape));

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
