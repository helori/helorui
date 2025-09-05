<template>

    <div class="grid gap-2">
        <input-checkbox
            v-for="option in options"
            class="text-sm font-normal"
            :key="option[valueKey]"
            :class="optionClass"
            :modelValue="has(option[valueKey])"
            @update:modelValue="() => toggle(option[valueKey])">
            <template #label>
                {{ option[labelKey] }}
            </template>
        </input-checkbox>
    </div>

</template>

<script>

import { defineComponent, ref, watch } from 'vue'
import InputCheckbox from './InputCheckbox'

export default defineComponent(
{
    components: {
        InputCheckbox,
    },

    props: {
        modelValue: {
            required: true,
        },
        options: {
            type: Array,
            required: true
        },
        labelKey: {
            type: String,
            default: 'label',
        },
        valueKey: {
            type: String,
            default: 'value',
        },
        optionClass: {
            type: String,
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

        function toggle(value)
        {
            let idx = indexForValue(value);

            if(idx === -1) { item.value.push(value); }
            else { item.value.splice(idx, 1); }

            update();
        }

        function has(value)
        {
            return (indexForValue(value) !== -1);
        }

        function indexForValue(value)
        {
            return item.value.findIndex(v => {
                return v === value;
            });
        }

        function update()
        {
            emit('update:modelValue', item.value);
        }

        return {
            item,
            update,
            toggle,
            has,
            indexForValue,
        };
    }
})
</script>

