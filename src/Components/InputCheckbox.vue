<template>
    <div
        @click="toggle()"
        class="w-full flex items-center gap-2 cursor-pointer dark:text-white">
        <checkbox :checked="item" />
        <div class="flex items-center gap-2 flex-wrap w-full">
            <slot name="label">{{ label }}</slot>
        </div>
    </div>
</template>

<script>

import { defineComponent, ref, watch } from 'vue'
import Checkbox from './Checkbox'

export default defineComponent(
{
    components: {
        Checkbox,
    },

    props: {
        modelValue: {
            required: true,
        },
        label: {
            type: String,
            required: false,
            default: '',
        },
    },

    emits: [
        'update:modelValue',
    ],

    setup(props, { emit })
    {
        const item = ref(props.modelValue);

        watch(() => props.modelValue, function(v){
            item.value = v;
        });

        function toggle()
        {
            item.value = !item.value;
            update();
        }

        function update()
        {
            emit('update:modelValue', item.value);
        }

        return {
            item,
            update,
            toggle,
        };
    }
})
</script>

