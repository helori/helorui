<template>
    <div role="tablist"
        :class="variant === 'plain'
            ? 'flex gap-2 w-full text-center'
            : 'flex gap-5 w-full overflow-x-auto border-b border-slate-200 dark:border-slate-700 text-sm font-bold'">
        <button
            v-for="t in tabs"
            :key="t.value"
            type="button"
            role="tab"
            :aria-selected="item === t.value"
            :class="[
                variant === 'plain' ? 'py-2 flex-grow font-bold rounded-t-md' : '-mb-px py-2 border-b-2 whitespace-nowrap transition-colors',
                (item === t.value) ? currentActiveClass : currentInactiveClass,
            ]"
            @click="setTab(t.value)">
            {{ t[labelField] }}
        </button>
    </div>
</template>

<script>

import { defineComponent, ref, watch, computed } from 'vue'

const UNDERLINE_ACTIVE = ['border-primary-600', 'text-primary-700', 'dark:border-primary-400', 'dark:text-primary-300'];
const UNDERLINE_INACTIVE = ['cursor-pointer', 'border-transparent', 'text-slate-500', 'hover:text-slate-900', 'hover:border-slate-300', 'dark:text-slate-400', 'dark:hover:text-white', 'dark:hover:border-slate-600'];

export default defineComponent({

    emits: ['update:tab'],
    
    props: {
        tab: {
            type: String,
            required: true,
        },
        tabs: {
            type: Array,
            required: true,
        },
        labelField: {
            type: String,
            required: false,
            default: 'label',
        },
        // 'underline' : onglets soulignés en indigo (par défaut) ; 'plain' : sans style de base, tout passe par activeClass / inactiveClass
        variant: {
            type: String,
            required: false,
            default: 'underline',
        },
        activeClass: {
            type: Array,
            required: false,
            default: null,
        },
        inactiveClass: {
            type: Array,
            required: false,
            default: null,
        },
    },

    setup(props, { emit })
    {
        const item = ref(props.tab);

        watch(() => props.tab, (newTab) => {
            setTab(newTab);
        })

        const currentActiveClass = computed(() => props.activeClass ?? UNDERLINE_ACTIVE);
        const currentInactiveClass = computed(() => props.inactiveClass ?? UNDERLINE_INACTIVE);

        function setTab(t){
            item.value = t;
            emit('update:tab', item.value);
        }
        
        return {
            item,
            setTab,
            currentActiveClass,
            currentInactiveClass,
        };
    }
})
</script>
