<template>

    <span
        ref="anchor"
        @mouseenter="open"
        @mouseleave="close"
        @focusin="open"
        @focusout="close"
        class="relative inline cursor-help">
        <slot></slot>
    </span>

    <!-- Bulle sombre dans <body>, centrée sous l'élément, gardée dans la fenêtre -->
    <teleport to="body">
        <div v-show="opened"
            ref="bubble"
            role="tooltip"
            class="fixed z-[70] w-max max-w-xs rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-lg pointer-events-none dark:bg-white dark:text-slate-900"
            :style="{ top: position.top + 'px', left: position.left + 'px' }">
            {{ text }}
        </div>
    </teleport>

</template>

<script>
    import { defineComponent, nextTick, ref } from 'vue'

    // Écart entre l'élément et la bulle, et entre la bulle et les bords de la fenêtre
    const GAP = 6;

    export default defineComponent({

        props: {
            text: {

            },
        },

        setup(props)
        {
            const anchor = ref(null);
            const bubble = ref(null);
            const opened = ref(false);
            const position = ref({ top: 0, left: 0 });

            function place()
            {
                if(!anchor.value || !bubble.value){
                    return;
                }
                const rect = anchor.value.getBoundingClientRect();
                const width = bubble.value.offsetWidth;
                const height = bubble.value.offsetHeight;
                const viewportWidth = document.documentElement.clientWidth;

                const left = Math.max(GAP, Math.min(rect.left + rect.width / 2 - width / 2, viewportWidth - width - GAP));
                // Au-dessus quand la place manque en dessous
                const below = rect.bottom + GAP;
                const top = (below + height > window.innerHeight - GAP) ? Math.max(GAP, rect.top - GAP - height) : below;

                position.value = { top, left };
            }

            function open()
            {
                if(!props.text){
                    return;
                }
                opened.value = true;
                nextTick(place);
            }

            function close()
            {
                opened.value = false;
            }

            function toggle()
            {
                opened.value ? close() : open();
            }

            return {
                anchor,
                bubble,
                position,
                opened,
                open,
                close,
                toggle,
            }
        }
    })
</script>
