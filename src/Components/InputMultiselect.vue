<template>

    <dropdown ref="dropdown"
        :close-on-click="false"
        align="left"
        :content-classes="contentClasses">

        <template #trigger>
            <div class="input text-sm flex items-center gap-2 cursor-pointer"
                :class="inputClasses">
                <div class="flex-grow truncate">
                    <template v-if="item.length > 0">
                        {{ $filters.implode(selectedLabels, ', ') }}
                    </template>
                    <template v-else>
                        {{ labelEmpty ? labelEmpty : $t('No selected value') }}
                    </template>
                </div>
                <div>
                    <svg class="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
        </template>

        <template #content>

            <div class="px-4 py-3 flex flex-col items-center gap-1 justify-end text-left">
                <div v-for="opt in options"
                    class="w-full flex items-center gap-2 text-left cursor-pointer"
                    @click="toggle(opt[valueKey])">

                    <div class="w-5 h-5 rounded-sm border border-gray-600 dark:border-gray-400 flex items-center justify-center"
                        :class="{
                            'bg-primary-600 dark:bg-primary-400 text-white': selected(opt[valueKey]),
                            'bg-white dark:bg-gray-700': !selected(opt[valueKey]),
                        }">
                        <svg v-show="selected(opt[valueKey])" class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    </div>

                    <div>
                        {{ opt[labelKey] }}
                    </div>
                </div>
            </div>

            <div class="px-4 pb-2">
                <button
                    type="button"
                    class="btn btn-white w-full text-sm"
                    @click="close">
                    {{ $t('Done') }}
                </button>
            </div>

        </template>
    </dropdown>

</template>

<script>

import { defineComponent, ref, watch, computed } from 'vue'

export default defineComponent(
{
    props: {
        value: {
            required: true,
            default: null
        },
        options: {
            type: Array,
            required: true,
        },
        valueKey: {
            type: String,
            default: 'value',
        },
        labelKey: {
            type: String,
            default: 'label',
        },
        labelEmpty: {
            type: String,
            default: null,
        },
        inputClasses: {
            default: []
        },
        contentClasses: {
            default: ['w-48']
        },
    },

    emits: [
        'update:value',
    ],

    setup(props, { emit })
    {
        const dropdown = ref(null);

        function close()
        {
            dropdown.value.close();
        }

        const item = ref(props.value ?? []);

        watch(() => props.value, (newValue) => {
            item.value = newValue ?? [];
        });

        function selected(value)
        {
            return item.value.includes(value);
        }

        function toggle(value)
        {
            const idx = item.value.indexOf(value);
            if(idx !== -1){
                item.value.splice(idx, 1);
            }else{
                item.value.push(value);
            }
            emit('update:value', item.value);
        }

        const selectedLabels = computed(function(){
            let labels = [];
            props.options.forEach(opt => {
                if(item.value.includes(opt[props.valueKey])){
                    labels.push(opt[props.labelKey]);
                }
            });
            return labels;
        });

        return {
            dropdown,
            close,

            item,
            selected,
            toggle,
            selectedLabels,
        };
    },
})
</script>
