<template>
    <alert type="info" v-if="status === 'pending'">
        <loader
            :icon-classes="iconClasses"
            :message-classes="messageClasses"
            :message="message" />
    </alert>
</template>

<script>
    import { defineComponent } from 'vue'
    import Alert from './Alert.vue'
    import Loader from './Loader.vue'

    export default defineComponent({
        components: {
            Alert,
            Loader,
        },
        props: {
            status: {
                required: true
            },
            message: {
                type: String,
                required: false,
                default: "",
            },
            iconClasses: {
                default: "size-5 text-blue-900 dark:text-blue-200",
            },
            messageClasses: {
                default: "",
            },
        }
    })
</script>
