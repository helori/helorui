<template>
    <div v-if="status === 'pending' || error" class="space-y-2">
        <request-status :status="status" :message="message" :icon-classes="iconClasses" :message-classes="messageClasses" />
        <request-error :error="error" />
    </div>
</template>

<script>
    import { defineComponent } from 'vue'
    import RequestStatus from './RequestStatus.vue'
    import RequestError from './RequestError.vue'

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
                default: "",
            },
            iconClasses: {
                default: "size-5 text-primary-600 dark:text-primary-400",
            },
            messageClasses: {
                default: "text-sm font-medium text-slate-500 dark:text-slate-400",
            },
        }
    })
</script>
