<template>

    <div ref="root" class="relative">

        <div @click="toggle"
            :class="triggerClasses">
            <slot name="trigger"></slot>
        </div>

        <!-- Panneau téléporté dans <body> en position fixe : un parent en overflow-hidden ne le coupe plus -->
        <teleport to="body" :disabled="!teleport">
            <transition
                enter-active-class="transition ease-out duration-150"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">

                <div v-show="open"
                    ref="panel"
                    data-dropdown-panel
                    class="z-[60] flex flex-col"
                    :class="[teleport ? 'fixed' : 'absolute mt-2', originClasses]"
                    :style="teleport ? panelStyle : null"
                    @click="contentClicked">
                    <div class="min-h-0 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
                        :class="contentClasses">
                        <slot name="content"></slot>
                    </div>
                </div>

            </transition>
        </teleport>

    </div>
</template>

<script>

import { defineComponent, computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";

// Écart entre le déclencheur et le panneau, et entre le panneau et les bords de la fenêtre
const GAP = 8;

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
        // false : le panneau reste dans le flux (absolute), comme avant
        teleport: {
            type: Boolean,
            default: true,
        },
    },

    emits: ['open', 'close'],

    setup(props, { emit })
    {
        const open = ref(false);
        const root = ref(null);
        const panel = ref(null);

        // Position fixe calculée depuis le déclencheur, au-dessus quand la place manque en dessous
        const position = ref({ top: null, bottom: null, left: 0, maxHeight: null, placement: 'bottom' });

        const panelStyle = computed(() => ({
            top: position.value.top !== null ? position.value.top + 'px' : null,
            bottom: position.value.bottom !== null ? position.value.bottom + 'px' : null,
            left: position.value.left + 'px',
            maxHeight: position.value.maxHeight ? position.value.maxHeight + 'px' : null,
        }));

        function place()
        {
            if(!open.value || !props.teleport || !root.value || !panel.value){
                return;
            }

            const trigger = root.value.getBoundingClientRect();
            const width = panel.value.offsetWidth;
            // Hauteur complète du contenu, pas celle déjà bridée par maxHeight
            const content = panel.value.firstElementChild ?? panel.value;
            const height = content.scrollHeight + content.offsetHeight - content.clientHeight;
            const viewportWidth = document.documentElement.clientWidth;
            const viewportHeight = window.innerHeight;

            let left = trigger.left;
            if(props.align === 'right'){
                left = trigger.right - width;
            }else if(props.align !== 'left'){
                left = trigger.left + (trigger.width - width) / 2;
            }
            left = Math.max(GAP, Math.min(left, viewportWidth - width - GAP));

            const spaceBelow = viewportHeight - trigger.bottom - 2 * GAP;
            const spaceAbove = trigger.top - 2 * GAP;
            const above = height > spaceBelow && spaceAbove > spaceBelow;

            position.value = {
                top: above ? null : trigger.bottom + GAP,
                bottom: above ? viewportHeight - trigger.top + GAP : null,
                left,
                maxHeight: Math.max(120, above ? spaceAbove : spaceBelow),
                placement: above ? 'top' : 'bottom',
            };
        }

        let frame = null;
        function schedulePlace()
        {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(place);
        }

        const originClasses = computed(() => {
            const vertical = position.value.placement === 'top' ? 'bottom' : 'top';
            if(props.align === 'left'){
                return props.teleport ? 'origin-' + vertical + '-left' : 'origin-top-left left-0';
            }
            if(props.align === 'right'){
                return props.teleport ? 'origin-' + vertical + '-right' : 'origin-top-right right-0';
            }
            return props.teleport ? 'origin-' + vertical : 'origin-top';
        });

        function toggle()
        {
            open.value = !open.value;
        }

        function close()
        {
            open.value = false;
        }

        function contentClicked()
        {
            if(props.closeOnClick){
                close();
            }
        }

        watch(open, (value) => {
            emit(value ? 'open' : 'close');
            if(value){
                nextTick(place);
            }
        });

        // Un clic hors du déclencheur et du panneau le ferme (plus de voile sombre)
        const closeOnOutside = (e) => {
            if(!open.value){
                return;
            }
            if(root.value?.contains(e.target) || panel.value?.contains(e.target)){
                return;
            }
            // Les panneaux ouverts depuis celui-ci (menu imbriqué, calendrier) sont eux aussi dans <body>
            if(e.target.closest?.('[data-dropdown-panel], .flatpickr-calendar')){
                return;
            }
            close();
        };

        const closeOnEscape = (e) => {
            if(open.value && e.key === 'Escape'){
                close();
            }
        };

        // Le contenu peut changer de taille pendant l'ouverture (liste filtrée, données chargées)
        let observer = null;

        onMounted(() => {
            document.addEventListener('keydown', closeOnEscape);
            document.addEventListener('pointerdown', closeOnOutside, true);
            window.addEventListener('resize', schedulePlace);
            window.addEventListener('scroll', schedulePlace, true);
            if(window.ResizeObserver && panel.value){
                observer = new ResizeObserver(schedulePlace);
                observer.observe(panel.value.firstElementChild ?? panel.value);
            }
        });

        onUnmounted(() => {
            document.removeEventListener('keydown', closeOnEscape);
            document.removeEventListener('pointerdown', closeOnOutside, true);
            window.removeEventListener('resize', schedulePlace);
            window.removeEventListener('scroll', schedulePlace, true);
            observer?.disconnect();
            cancelAnimationFrame(frame);
        });

        return {
            open,
            root,
            panel,
            panelStyle,
            originClasses,
            toggle,
            close,
            contentClicked,
        }
    },
})
</script>
