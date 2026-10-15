<template>
    <modal :show="show" :max-width-class="maxWidthClass" :closeable="closeable" @close="close">

        <div class="flex items-center gap-4 px-6 pt-5"
            :class="headerClass">
            <div class="w-10 h-10 shrink-0 rounded-full flex items-center justify-center"
                :class="typeIcon.classes"
                v-if="typeIcon">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="typeIcon.path" />
                </svg>
            </div>
            <div class="flex-grow min-w-0 text-lg font-bold text-slate-900 dark:text-white">
                <slot name="title"></slot>
            </div>
            <button type="button"
                class="-mr-2 p-2 shrink-0 self-start rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                :title="$t('Close')"
                v-if="closeable"
                @click="close">
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div :class="contentClass">
            <slot name="content"></slot>
        </div>

        <div class="px-6 py-4 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60"
            v-if="$slots.footer">
            <slot name="footer"></slot>
        </div>

    </modal>
</template>

<script>
    import { defineComponent, ref, computed } from 'vue'
    import Modal from './Modal.vue'

    // Pastille à gauche du titre selon la nature du message
    const TYPE_ICONS = {
        success: {
            path: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
            classes: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
        },
        danger: {
            path: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z',
            classes: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
        },
        warning: {
            path: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z',
            classes: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
        },
        info: {
            path: 'm11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z',
            classes: 'bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400',
        },
    };
    TYPE_ICONS.error = TYPE_ICONS.danger;

    export default defineComponent({

        emits: ['open', 'close'],

        components: {
            Modal,
        },

        props: {
            maxWidthClass: {
                default: 'max-w-screen-lg'
            },
            closeable: {
                default: true
            },
            // success, error / danger, warning, info : pastille d'icône à gauche du titre
            type: {
                type: String,
                default: null,
            },
            headerClass: {
                default: ''
            },
            contentClass: {
                default: 'px-6 py-5 text-slate-600 dark:text-slate-300'
            },
        },

        setup(props, { emit }){
            const show = ref(false);

            const typeIcon = computed(() => TYPE_ICONS[props.type] ?? null);

            function close() {
                show.value = false;
                emit('close');
            }

            function open() {
                show.value = true;
                emit('open');
            }

            return {
                typeIcon,
                show,
                open,
                close,
            }
        },
    })
</script>
