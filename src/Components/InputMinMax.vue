<template>

    <div class="text-sm flex w-full font-medium rounded-md border border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 shadow-sm overflow-hidden focus-within:border-primary-400 focus-within:ring focus-within:ring-primary-200 focus-within:ring-opacity-50 dark:focus-within:border-primary-500 dark:focus-within:ring-primary-900">
        <div class="whitespace-nowrap pl-2 py-2 z-0 text-slate-500 dark:text-slate-400">
            Min :
        </div>
        <input
            type="number"
            class="text-sm input border-none text-center flex-grow w-10 px-2 font-bold rounded-none shadow-none z-10 focus:ring-0 text-slate-900 dark:text-white placeholder:font-medium"
            placeholder="aucun"
            v-model.number="item.min"
            @change="update">
        <div v-if="suffix" class="whitespace-nowrap pr-2 py-2 w-6 flex-none z-0 text-slate-500 dark:text-slate-400">
            {{ suffix }}
        </div>
        <div class="whitespace-nowrap pl-2 border-l border-slate-300 dark:border-slate-500 py-2 rounded-none z-0 text-slate-500 dark:text-slate-400">
            Max :
        </div>
        <input
            type="number"
            class="text-sm input border-none text-center flex-grow w-10 px-2 font-bold rounded-none shadow-none z-10 focus:ring-0 text-slate-900 dark:text-white placeholder:font-medium"
            placeholder="aucun"
            v-model.number="item.max"
            @change="update">
        <div v-if="suffix" class="whitespace-nowrap pr-2 py-2 rounded-r-md z-0 text-slate-500 dark:text-slate-400">
            {{ suffix }}
        </div>
    </div>

</template>

<script>

import { defineComponent, ref, watch } from 'vue'

export default defineComponent(
{
    props: {
        modelValue: {
            required: true,
        },
        suffix: {
            default: ''
        },
    },

    emits: [
        'update:modelValue',
    ],

    setup(props, { emit })
    {
        const item = ref(props.modelValue);

        watch(() => props.modelValue, function(v){
            Object.assign(item.value, v);
        });

        function update()
        {
            emit('update:modelValue', item.value);
        }

        return {
            item,
            update,
        };
    }
})
</script>

