<template>
    <!-- Toute la ligne est cliquable : la case à gauche, son libellé à droite -->
    <div
        role="checkbox"
        tabindex="0"
        :aria-checked="!!item"
        @click="toggle()"
        @keydown.space.prevent="toggle()"
        class="w-full flex items-start gap-2 cursor-pointer select-none rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:focus-visible:ring-primary-700">
        <checkbox class="mt-0.5" :checked="!!item" />
        <div class="flex items-center gap-2 flex-wrap w-full">
            <slot name="label">{{ label }}</slot>
        </div>
    </div>
</template>

<script>

import { defineComponent, ref, watch } from 'vue'
import Checkbox from './Checkbox.vue'

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
