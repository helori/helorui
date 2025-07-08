<template>

    <div
        ref="tooltipAnchor"
        @mouseover="open"
        @mouseleave="close"
        class="relative inline cursor-pointer">
        <slot></slot>

        <div v-show="opened"
            class="fixed z-50 bg-gray-200 rounded-md py-3 px-4 shadow-lg text-xs font-medium text-black"
            :style="'top: ' + offset.top + 'px; left: ' + offset.left + 'px; width: ' + width + 'px;'">
            {{ text }}
        </div>
    </div>

    <!--div v-if="opened" class="fixed z-40 w-full h-full inset-0 bg-black/70" @click="close">
        <div class="absolute inset-0 flex flex-col items-center justify-center" @click="$event.stopPropagation()">
            <div class="rounded-lg shadow-lg bg-white p-8 max-w-screen-sm">
                <div>{{ text }}</div>
                <div class="text-center mt-4">
                    <a class="btn-link btn-link-primary"
                        @click="close">
                        {{ $t('Close') }}
                    </a>
                </div>
            </div>
        </div>
    </div-->

</template>

<script>
    import { defineComponent, ref } from 'vue'

    export default defineComponent({

        props: {
            text: {

            },
        },

        setup(props, {slots})
        {
            const tooltipAnchor = ref(null);
            const width = ref(300);
            const offset = ref({
                left: 0,
                top: 0,
            })
            const opened = ref(false);

            function open()
            {
                let o = getElementOffset(tooltipAnchor.value);

                o.left = Math.max(10, o.left);
                o.top = Math.max(10, o.top);

                offset.value = o;

                opened.value = true;
            }

            function close()
            {
                opened.value = false;
            }

            function toggle()
            {
                opened.value = !opened.value;
            }

            function getElementOffset(el)
            {
                const rect = el.getBoundingClientRect();
                return {
                    left: rect.left + window.scrollX - width.value / 2 + rect.width / 2,
                    top: rect.top + window.scrollY + rect.height + 2,
                };
            }

            return {
                tooltipAnchor,
                offset,
                width,
                opened,
                open,
                close,
                toggle,
            }
        }
    })
</script>
