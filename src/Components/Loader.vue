<template>
    <div class="flex items-center gap-2">

        <svg class="shrink-0 animate-spin"
            :class="iconClasses"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true">
            <circle class="opacity-20" cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="3" />
            <path class="opacity-90" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5" />
        </svg>

        <div class="min-w-0 flex-grow" v-if="message">
            <span :class="messageClasses">{{ message }}</span>
        </div>

    </div>
</template>

<script>
    import { defineComponent } from 'vue'
    export default defineComponent({
        props: {
            message: {
                type: String,
                required: false,
                default: "",
            },
            iconClasses: {
                default: ["size-5", "text-primary-600", "dark:text-primary-400"],
            },
            messageClasses: {
                default: "text-sm font-medium text-slate-500 dark:text-slate-400",
            },
        }
    })
</script>
