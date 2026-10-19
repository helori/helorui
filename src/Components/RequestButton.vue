<template>
    <button
        :disabled="pending"
        :aria-busy="pending"
        :class="{ 'cursor-wait opacity-80': pending }">
        <span class="flex gap-2 items-center mx-auto justify-center">
            <loader v-if="pending"
                :message="pendingMessage"
                :message-classes="''"
                :icon-classes="iconClasses" />
            <span v-if="!pending || !pendingMessage">
                <slot></slot>
            </span>
        </span>
    </button>
</template>

<script>
    import { defineComponent, computed } from 'vue'
    import Loader from './Loader.vue'

    export default defineComponent({
        components: {
            Loader,
        },
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
            // Sans couleur : le spinner prend celle du texte du bouton (blanc sur btn-primary)
            iconClasses: {
                default: 'size-4',
            },
        },

        setup(props)
        {
            const pending = computed(() => props.status === 'pending' && props.disabledOnlyCondition);

            return {
                pending,
            };
        },
    })
</script>
