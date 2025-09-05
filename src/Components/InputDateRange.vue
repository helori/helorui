<template>

    <VueDatePicker 
        class="!w-72"
        v-model="item"
        @update:model-value="setItem"
        locale="fr"
        :range="true"
        :enable-time-picker="false"
        :auto-apply="true"
        input-class-name="input !w-72 !py-2 !rounded-md"
        format="dd/MM/yyyy">
    </VueDatePicker>
    
    <!--div>
        {{ period }}
        {{ item }}
    </div-->

</template>

<script>

import { defineComponent, ref, watch, onMounted } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

export default defineComponent({

    components: {
        // https://vue3datepicker.com/props/general-configuration/#auto-apply
        VueDatePicker,
    },

    data(){
        return {
            pickerReady: false,
        };
    },

    props: {
        period: {
            required: true,
        },
        options: {
            type: Object,
            required: false,
            default(){
                return {};
            }
        },
        classes: {
            required: false,
            default: [],
        },
    },

    emits: [
        'update:period',
    ],

    setup(props, { emit })
    {
        const item = ref([]);

        function setItem(v)
        {
            item.value = v;
            
            emit('update:period', {
                start: item.value[0],
                end: item.value[1],
            });
        }

        function setPeriod(p)
        {
            item.value = [
                new Date(p && p.start ? p.start : null).toISOString(),
                new Date(p && p.end ? p.end : null).toISOString(),
            ];
        }

        watch(() => props.period, function(p){
            setPeriod(p);
        });

        setPeriod(props.period);

        return {
            item,
            setItem,
        };
    }
})
</script>

