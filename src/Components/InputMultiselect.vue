<template>

    <dropdown ref="dropdown"
        :close-on-click="false"
        align="left"
        :content-classes="['!py-0', 'flex', 'flex-col', ...[].concat(contentClasses)]"
        @open="opened"
        @close="query = ''">

        <template #trigger>
            <button type="button"
                class="input text-sm flex items-center gap-2 text-left cursor-pointer"
                :class="inputClasses">
                <span class="flex-grow min-w-0 truncate"
                    :class="{ 'text-slate-500 dark:text-slate-400': item.length === 0 }">
                    <template v-if="item.length > 0">
                        {{ selectedLabels.join(', ') }}
                    </template>
                    <template v-else>
                        {{ labelEmpty ? labelEmpty : $t('No selected value') }}
                    </template>
                </span>
                <span v-if="item.length > 1"
                    class="shrink-0 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-bold tabular-nums text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                    {{ item.length }}
                </span>
                <svg class="shrink-0 size-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </button>
        </template>

        <template #content>

            <!-- Recherche, dès que la liste est longue -->
            <div v-if="searchable" class="shrink-0 p-2 border-b border-slate-200 dark:border-slate-700">
                <input ref="search"
                    type="search"
                    class="input w-full !py-1.5 text-sm"
                    :placeholder="$t('Filter')"
                    v-model="query"
                    @keydown.enter.prevent="toggleFirst" />
            </div>

            <ul class="min-h-0 max-h-72 overflow-y-auto py-1" role="listbox" aria-multiselectable="true">
                <li v-for="opt in filteredOptions"
                    :key="opt[valueKey]"
                    role="option"
                    :aria-selected="selected(opt[valueKey])"
                    class="flex items-center gap-2.5 px-3 py-1.5 text-sm cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-800"
                    :class="selected(opt[valueKey]) ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'"
                    @click="toggle(opt[valueKey])">

                    <checkbox :checked="selected(opt[valueKey])" />

                    <span class="min-w-0 truncate">{{ opt[labelKey] }}</span>
                </li>

                <li v-if="filteredOptions.length === 0"
                    class="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                    {{ $t('No results') }}
                </li>
            </ul>

            <div class="shrink-0 flex items-center gap-2 px-3 py-2 border-t border-slate-200 bg-slate-50 rounded-b-lg dark:border-slate-700 dark:bg-slate-800/50">
                <button type="button"
                    class="text-sm font-bold text-primary-600 hover:text-primary-700 disabled:text-slate-400 disabled:cursor-default dark:text-primary-400 dark:hover:text-primary-300 dark:disabled:text-slate-500"
                    :disabled="item.length === 0"
                    @click="clear">
                    {{ $t('Clear') }}
                </button>
                <button type="button"
                    class="ml-auto btn btn-white btn-sm"
                    @click="close">
                    {{ $t('Done') }}
                </button>
            </div>

        </template>
    </dropdown>

</template>

<script>

import { defineComponent, ref, watch, computed, nextTick } from 'vue'
import Dropdown from './Dropdown.vue'
import Checkbox from './Checkbox.vue'

// Au-delà de ce nombre d'options, un champ de recherche filtre la liste
const SEARCH_THRESHOLD = 8;

// Comparaison sans casse ni accents : « reseau » trouve « Réseau »
function normalize(text)
{
    return String(text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export default defineComponent(
{
    components: {
        Dropdown,
        Checkbox,
    },

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
            default: ['w-64']
        },
    },

    emits: [
        'update:value',
    ],

    setup(props, { emit })
    {
        const dropdown = ref(null);
        const search = ref(null);

        function close()
        {
            dropdown.value.close();
        }

        const item = ref([...(props.value ?? [])]);

        watch(() => props.value, (newValue) => {
            item.value = [...(newValue ?? [])];
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
            emit('update:value', [...item.value]);
        }

        function clear()
        {
            item.value = [];
            emit('update:value', []);
        }

        // ----------------------------------------------------
        //  Recherche
        // ----------------------------------------------------
        const query = ref('');
        const searchable = computed(() => props.options.length > SEARCH_THRESHOLD);

        const filteredOptions = computed(() => {
            const q = normalize(query.value.trim());
            return q
                ? props.options.filter(opt => normalize(opt[props.labelKey]).includes(q))
                : props.options;
        });

        function toggleFirst()
        {
            if(filteredOptions.value.length){
                toggle(filteredOptions.value[0][props.valueKey]);
            }
        }

        function opened()
        {
            if(searchable.value){
                nextTick(() => search.value?.focus());
            }
        }

        // Libellés dans l'ordre des options, pas dans l'ordre où on les a cochées
        const selectedLabels = computed(() => props.options
            .filter(opt => item.value.includes(opt[props.valueKey]))
            .map(opt => opt[props.labelKey]));

        return {
            dropdown,
            search,
            close,

            item,
            selected,
            toggle,
            clear,
            selectedLabels,

            query,
            searchable,
            filteredOptions,
            toggleFirst,
            opened,
        };
    },
})
</script>
