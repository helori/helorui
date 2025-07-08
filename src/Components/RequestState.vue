<template>
    <div v-if="status === 'pending' || error">
        <request-status :status="status" :message="message" :icon-classes="iconClasses" :message-classes="messageClasses" />
        <request-error :error="error" />
    </div>
</template>

<script>
    import { defineComponent } from 'vue'
    import RequestStatus from './RequestStatus'
    import RequestError from './RequestError'

    export default defineComponent({

        components: {
            RequestStatus,
            RequestError,
        },

        props: {
            status: {
                required: true,
                default: null,
            },
            error: {
                required: false,
                default: null,
            },
            message: {
                type: String,
                required: false,
                default: "Loading...",
            },
            iconClasses: {
                default: "size-5 text-gray-900",
            },
            messageClasses: {
                default: "",
            },
        }
    })
</script>
