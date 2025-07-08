<template>
    <dialog-modal
        ref="dialog"
        :max-width-class="maxWidthClass">

        <template #title>
            {{ title }}
        </template>

        <template #content>
            <slot name="content"></slot>
            <request-error :error="error" class="mt-2" />
        </template>

        <template #footer>
            <div class="flex items-center gap-2 justify-end">
                <button
                    type="button"
                    class="btn btn-white"
                    @click="close">
                    {{ cancelText ?? $t('Cancel') }}
                </button>

                <request-button
                    class="btn"
                    :class="{
                        'btn-primary': (type === 'primary'),
                        'btn-red': (type === 'danger'),
                    }"
                    :disabled-only-condition="enabled"
                    :status="status"
                    :error="error"
                    @click="request">
                    {{ button ?? $t('Save') }}
                </request-button>
            </div>
        </template>

    </dialog-modal>
</template>

<script>
    import { defineComponent, ref } from 'vue'
    import { useRequest } from '../Functions/useRequest'
    import RequestError from './RequestError'
    import RequestButton from './RequestButton'

    export default defineComponent({

        components: {
            RequestError,
            RequestButton,
        },

        emits: ['open', 'close'],

        props: {
            maxWidthClass: {
                default: 'max-w-screen-lg'
            },
            type: {
                type: String,
                required: false,
                default: 'primary',
            },
            title: {
                type: String,
                required: true,
            },
            button: {
                type: String,
                required: false,
                default: null,
            },
            cancelText: {
                type: String,
                required: false,
                default: null,
            },
            callback: {
                required: true,
            },
            enabled: {
                type: Boolean,
                default: true,
            }
        },

        setup(props, { emit })
        {
            const dialog = ref(null);

            const {
                status,
                error,
                send,
                data,
                params,
            } = useRequest();

            function request(){
                props.callback();
            }

            function open() {
                dialog.value.open();
                //this.$refs.input.focus();
                emit('open');
            }

            function close() {
                dialog.value.close();
                emit('close');
            }

            return {
                status,
                error,
                send,
                data,
                params,
                request,

                dialog,
                open,
                close,
            }
        },
    })
</script>
