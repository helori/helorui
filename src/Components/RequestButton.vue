<template>
    <button
        :disabled="(status === 'pending') && disabledOnlyCondition"
        :class="{ 'opacity-75': (status === 'pending') && disabledOnlyCondition }">
        <div class="flex gap-2 items-center mx-auto justify-center">
            <div v-if="(status === 'pending') && disabledOnlyCondition">
                <loader :message="pendingMessage"
                    :icon-classes="iconClasses" />
            </div>
            <div>
                <slot></slot>
            </div>
        </div>
    </button>
</template>

<script>
    import { defineComponent } from 'vue'

    export default defineComponent({
        props: {
            status: {
                required: true
            },
            error: {
                required: true
            },
            disabledOnlyCondition: {
                type: Boolean,
                required: false,
                default: true,
            },
            pendingMessage: {
                type: String,
                default: '',
            },
            iconClasses: {
                default: 'w-5 h-5 text-gray-900 dark:text-white',
            },
        },
    })
</script>
