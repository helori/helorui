<template>
   <div class="flex gap-2 w-full text-center">
        <div 
            v-for="(t, idx) in tabs"
            :key="t.value"
            class="py-2 flex-grow b-bottom font-bold rounded-t-md"
            @click="setTab(t.value)"
            :class="(item === t.value) ? activeClass : inactiveClass">
            {{ t[labelField] }}
        </div>
    </div>
</template>

<script>

import { defineComponent, ref, watch } from 'vue'

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
        activeClass: {
            type: Array,
            required: false,
            default: ['bg-gray-100', 'border-gray-100'],
        },
        inactiveClass: {
            type: Array,
            required: false,
            default: [
                'bg-gray-300', 
                'border-gray-300', 
                'text-gray-600', 
                'cursor-pointer'
            ],
        },
    },

    setup(props, { emit })
    {
        const item = ref(props.tab);

        watch(() => props.tab, (newTab) => {
            setTab(newTab);
        })

        function setTab(t){
            item.value = t;
            emit('update:tab', item.value);
        }
        
        return {
            item,
            setTab,
        };
    }
})
</script>
