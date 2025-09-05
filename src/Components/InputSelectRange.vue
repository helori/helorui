<template>

    <div class="text-sm flex w-full font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 overflow-hidden">
        <div class="whitespace-nowrap pl-2 py-2 z-0 text-gray-500 dark:text-gray-200">
            {{ minLabel }} :
        </div>
        <select
            class="text-sm input border-none text-center flex-grow w-10 px-2 font-semibold rounded-none z-10 focus:ring-0 dark:text-white"
            v-model.number="item.min"
            @change="update">
            <option v-for="option in options"
                :value="option[valueField]">
                {{ option[labelField] }}
            </option>
        </select>
        <div v-if="suffix" class="whitespace-nowrap pr-2 py-2 w-6 flex-none z-0 text-gray-500 dark:text-gray-200">
            {{ suffix }}
        </div>
        <div class="whitespace-nowrap pl-2 border-l border-gray-300 dark:border-gray-600 py-2 rounded-none z-0 text-gray-500 dark:text-gray-200">
            {{ maxLabel }} :
        </div>
        <select
            class="text-sm input border-none text-center flex-grow w-10 px-2 font-semibold rounded-none z-10 focus:ring-0 dark:text-white"
            v-model.number="item.max"
            @change="update">
            <option v-for="option in options"
                :value="option[valueField]">
                {{ option[labelField] }}
            </option>
        </select>
        <div v-if="suffix" class="whitespace-nowrap pr-2 py-2 rounded-r-md z-0 text-gray-500 dark:text-gray-200">
            {{ suffix }}
        </div>
    </div>

</template>

<script>

import { defineComponent, ref } from 'vue'

export default defineComponent(
{
    props: {
        modelValue: {
            required: true,
        },
        suffix: {
            default: ''
        },
        options: {
            type: Array,
            required: true,
        },
        valueField: {
            type: String,
            required: false,
            default: 'value',
        },
        labelField: {
            type: String,
            required: false,
            default: 'label',
        },
        minLabel: {
            type: String,
            required: false,
            default: 'Min',
        },
        maxLabel: {
            type: String,
            required: false,
            default: 'Max',
        },
    },

    emits: [
        'update:modelValue',
    ],

    setup(props, { emit })
    {
        const item = ref(props.modelValue);

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

