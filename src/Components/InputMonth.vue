<template>

    <dropdown
        ref="dropdown"
        :align="align"
        :content-classes="['py-1', 'bg-white', 'dark:bg-gray-900', 'w-60']"
        trigger-classes="p-2 h-full"
        :close-on-click="false">

        <template #trigger>
            <div class="font-semibold text-black dark:text-white">
                {{ monthLabel(item.month) }} {{ item.year }}
            </div>
            <!--div class="text-xs leading-4 font-medium dark:text-white">
                {{ item.year }}
            </div-->
        </template>

        <template #content>
            <div class="p-2 flex items-center gap-2 border-b border-gray-600">

                <button class="btn btn-gray p-2 text-sm"
                    @click="prevYear">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                <div class="flex-grow text-center">
                    {{ item.year }}
                </div>

                <button class="btn btn-gray p-2 text-sm"
                    @click="nextYear">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>

            </div>

            <div class="p-2 grid grid-cols-3 gap-1">
                <div v-for="month in months"
                    class="py-1 px-2 rounded-md text-center cursor-pointer"
                    :class="month.value === item.month ? 'bg-primary-600 text-white' : 'hover:bg-gray-700 hover:text-white'"
                    @click="setMonth(month.value)">
                    {{ month.short }}
                </div>
            </div>

            <!--div class="p-2 border-t border-gray-600">
                <button class="btn btn-gray text-sm py-2 w-full"
                    @click="close">
                    Fermer
                </button>
            </div-->

        </template>

    </dropdown>

</template>

<script>

import { defineComponent, reactive, ref, watch } from 'vue'

export default defineComponent(
{
    props: {
        modelValue: {
            required: true,
        },
        align: {
            default: 'right'
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
        });

        function update()
        {
            emit('update:modelValue', item);
        }

        const years = ref([]);
        let curY = parseInt((new Date()).getFullYear());
        for(var y = props.fromYear; y <= curY; ++y){
            years.value.push({ value: y, name: y });
        }

        const months = ref([
            { value: 1, short: 'Janv.', name: 'Janvier' },
            { value: 2, short: 'Févr.', name: 'Février' },
            { value: 3, short: 'Mars', name: 'Mars' },
            { value: 4, short: 'Avril', name: 'Avril' },
            { value: 5, short: 'Mai', name: 'Mai' },
            { value: 6, short: 'Juin', name: 'Juin' },
            { value: 7, short: 'Juil.', name: 'Juillet' },
            { value: 8, short: 'Août', name: 'Août' },
            { value: 9, short: 'Sept.', name: 'Septembre' },
            { value: 10, short: 'Oct.', name: 'Octobre' },
            { value: 11, short: 'Nov.', name: 'Novembre' },
            { value: 12, short: 'Déc.', name: 'Décembre' },
        ])

        function prevYear(){
            item.year = Math.max(2014, item.year - 1);
            update();
        }

        function nextYear(){
            item.year = Math.min(curY, item.year + 1);
            update();
        }

        function setMonth(m){
            item.month = m;
            update();
        }

        function monthLabel(m){
            return months.value.find(month => {
                return (month.value === m);
            }).short;
        }

        const dropdown = ref(null);

        function close()
        {
            dropdown.value.open = false;
        }

        return {
            dropdown,

            item,
            update,

            years,
            prevYear,
            nextYear,

            months,
            setMonth,
            monthLabel,

            close,
        };
    }
})
</script>

