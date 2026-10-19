<template>

    <div class="text-sm grid grid-cols-2 w-full font-medium rounded-md border border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 shadow-sm">
        <div class="flex items-center">
            <div class="whitespace-nowrap pl-2 py-2 z-0 text-slate-500 dark:text-slate-400">
                De :
            </div>

            <input-month
                align="left"
                v-model:modelValue="item.start"
                @update:modelValue="update"
                :from-year="fromYear" />
        </div>
        <div class="flex">

            <div class="whitespace-nowrap pl-2 border-l border-slate-300 dark:border-slate-500 py-2 rounded-none z-0 text-slate-500 dark:text-slate-400">
                À :
            </div>

            <input-month
                align="right"
                v-model:modelValue="item.end"
                @update:modelValue="update"
                :from-year="fromYear" />
        </div>
    </div>

</template>

<script>

import { defineComponent, reactive, watch } from 'vue'
import InputMonth from './InputMonth'

export default defineComponent(
{
    components: {
        InputMonth,
    },

    props: {
        modelValue: {
            required: true,
        },
        fromYear: {
            required: false,
            default: 2014,
        },
    },

    emits: [
        'update:modelValue',
    ],

    setup(props, { emit })
    {
        const item = reactive(props.modelValue);

        watch(() => props.modelValue, function(v){
            Object.assign(item, v);
        })

        function update()
        {
            emit('update:modelValue', item);
        }

        return {
            item,
            update,
        };
    }
})
</script>

