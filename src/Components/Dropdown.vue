<template>

    <!-- Full Screen Dropdown Overlay -->
    <div v-show="open" class="fixed inset-0 z-50 bg-black/50" @click="open = false"></div>

    <div class="relative">

        <div @click="open = !open"
            :class="triggerClasses">
            <slot name="trigger"></slot>
        </div>

        <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">

            <div v-show="open"
                class="absolute z-50 mt-2 rounded-md shadow-lg"
                :class="[alignmentClasses]"
                @click="contentClicked">
                <div class="rounded-md ring-1 ring-black ring-opacity-5 py-1 bg-white dark:bg-gray-800"
                    :class="contentClasses">
                    <slot name="content"></slot>
                </div>
            </div>

        </transition>

    </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
export default defineComponent({
    props: {
        align: {
            default: 'right'
        },
        triggerClasses: {
            default: () => []
        },
        contentClasses: {
            default: ['w-48'],
        },
        closeOnClick: {
            type: Boolean,
            default: true,
        },
    },
    setup(props)
    {
        let open = ref(false)

        const closeOnEscape = (e) => {
            if (open.value && e.keyCode === 27) {
                open.value = false;
            }
        }

        onMounted(() => document.addEventListener('keydown', closeOnEscape))
        onUnmounted(() => document.removeEventListener('keydown', closeOnEscape))

        function contentClicked()
        {
            if(props.closeOnClick){
                close();
            }
        }

        function close()
        {
            open.value = false;
        }

        return {
            open,
            close,
            contentClicked,
        }
    },
    computed: {
        alignmentClasses() {
            if (this.align === 'left') {
                return 'origin-top-left left-0'
            } else if (this.align === 'right') {
                return 'origin-top-right right-0'
            } else {
                return 'origin-top'
            }
        },
    }
})
</script>
