<template>
    <div class="flex items-baseline gap-2 text-sm"
        v-if="!isEmpty || !hideOnNull">
        <div class="shrink-0 max-w-[60%] text-slate-500 dark:text-slate-400"
            :class="labelClass">
            {{ label }}{{ semicolon ? '\u00a0:' : '' }}
        </div>
        <div class="min-w-0 flex break-words text-left text-slate-900 dark:text-white" :class="valueClass">
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
                <template v-else-if="type === 'siren'">
                    {{ $filters.siren(value) }}
                </template>
                <template v-else-if="type === 'siret'">
                    {{ $filters.siret(value) }}
                </template>
                <template v-else-if="type === 'email'">
                    <a :href="'mailto:' + value" target="_blank" class="text-primary-600 hover:underline dark:text-primary-400">{{ value }}</a>
                </template>
                <template v-else-if="type === 'url'">
                    <a :href="value" target="_blank" class="text-primary-600 hover:underline dark:text-primary-400">{{ value }}</a>
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
                class="ml-1 font-medium text-slate-500 dark:text-slate-400">
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
