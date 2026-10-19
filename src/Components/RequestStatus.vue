<template>
    <!-- Un chargement n'est pas un message : une ligne discrète, pas de bloc coloré -->
    <div v-if="status === 'pending'" class="py-2" role="status" aria-live="polite">
        <loader
            :icon-classes="iconClasses"
            :message-classes="messageClasses"
            :message="message || $t('Loading...')" />
    </div>
</template>

<script>
    import { defineComponent } from 'vue'
    import Loader from './Loader.vue'

    export default defineComponent({
        components: {
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
                default: "size-5 text-primary-600 dark:text-primary-400",
            },
            messageClasses: {
                default: "text-sm font-medium text-slate-500 dark:text-slate-400",
            },
        }
    })
</script>
