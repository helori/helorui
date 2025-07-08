<template>
    <div>
        <div class="flex flex-col md:flex-row md:items-center md:flex-wrap gap-2">
            <div class="flex-grow"
                v-if="title || slots.title"
                @click="toggleFilters">
                <div class="text-base md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-1 cursor-pointer md:cursor-default">
                    <div class="md:hidden">
                        <svg v-if="!filtersOpened" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                        <svg v-if="filtersOpened" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                    <div class="flex-grow">
                        <slot name="title">{{ title }}</slot>
                    </div>
                </div>
            </div>
            <template v-if="filtersOpened">
                <input
                    v-if="hasSearch"
                    type="search"
                    class="input flex-grow w-full md:w-auto"
                    :class="inputClasses"
                    :placeholder="placeholder ?? $t('Search')"
                    v-model="item"
                    @input="emitDebounced(item)"
                    autocomplete="off">
                <slot></slot>
            </template>
        </div>
    </div>
</template>

<script>
    import { defineComponent, ref, watch, useSlots } from 'vue'

    export default defineComponent({

        props: {
            hasSearch: {
                type: Boolean,
                default: true,
            },
            search: String,
            title: String,
            inputClasses: String,
            placeholder: {
                type: String,
                default: null,
            },
            debounceMs: {
                default: 300
            },
        },

        emits: ['update:search'],

        setup(props, { emit }){

            const slots = useSlots();

            const item = ref(props.search);

            watch(() => props.search, (newValue) => {
                item.value = newValue;
            })

            let debounceTimer = null;

            function emitDebounced(value)
            {
                clearTimeout(debounceTimer);

                debounceTimer = setTimeout(function(){
                    emit('update:search', value);
                }, props.debounceMs);
            }

            const filtersOpened = ref(!isMobile());

            function toggleFilters()
            {
                if(isMobile()){
                    filtersOpened.value = !filtersOpened.value;
                }
            }

            function isMobile()
            {
                let mobileWidth = parseInt(window.tailwindcss.theme.screens.md);
                let windowWidth =  window.innerWidth;
                return (windowWidth <= mobileWidth)
            }

            return {
                slots,
                item,
                emitDebounced,
                filtersOpened,
                toggleFilters,
            }
        }
    })
</script>
