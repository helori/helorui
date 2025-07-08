<template>
    <div class="flex gap-2"
        v-if="!isEmpty || !hideOnNull">
        <div class="text-gray-600 dark:text-gray-400 sm:shrink-0 text-xs sm:text-sm uppercase sm:normal-case"
            :class="labelClass">
            {{ label }}
            {{ semicolon ? ':' : '' }}
        </div>
        <div class="dark:text-white flex text-sm sm:text-sm text-left" :class="valueClass">
            <span>
                <template v-if="type === 'date'">
                    {{ $filters.date(value, params.outputFormat ? params.outputFormat : null, params.inputFormat ? params.inputFormat : null) }}
                </template>
                <template v-else-if="type === 'dateLocalized'">
                    {{ $filters.dateLocalized(value) }}
                </template>
                <template v-else-if="type === 'number'">
                    {{ $filters.number(value, params.decimals ? params.decimals : 0) }}
                </template>
                <template v-else-if="type === 'boolean'">
                    {{ $filters.boolean(value) }}
                </template>
                <template v-else-if="type === 'email'">
                    <a :href="'mailto:' + value" target="_blank" class="text-primary underline">{{ value }}</a>
                </template>
                <template v-else-if="type === 'url'">
                    <a :href="value" target="_blank" class="text-primary underline">{{ value }}</a>
                </template>
                <template v-else-if="type === 'html'">
                    <div v-html="value"></div>
                </template>
                <template v-else>
                    {{ value }}
                </template>
                <slot name="value"></slot>
            </span>
            <span v-if="suffix && !isEmpty"
                class="ml-1">
                {{ suffix }}
            </span>
        </div>
    </div>
</template>

<script>
    import { defineComponent, computed } from 'vue'
    export default defineComponent({
        props: {
            label: {
                type: String,
                required: true,
            },
            value: {
                required: true,
            },
            hideOnNull: {
                type: Boolean,
                default: true,
            },
            type: {
                type: String,
                default: 'string',
                required: false,
            },
            suffix: {
                type: String,
                default: null,
                required: false,
            },
            labelClass: {
                default: '',
                required: false,
            },
            valueClass: {
                default: 'font-bold',
                required: false,
            },
            semicolon: {
                type: Boolean,
                default: true
            },
            params: {
                type: Object,
                required: false,
                default(){
                    return {};
                },
            }
        },

        setup(props){
            const isEmpty = computed(() => {
                return (props.value === null) || (props.value === '') || (props.value === undefined);
            });

            return {
                isEmpty,
            };
        }
    })
</script>
