<template>    
    <div class="flex flex-row justify-start items-center gap-2 cursor-pointer"
        @click="toggle">
        <div v-show="item.orderBy === orderKey">
            <div v-show="item.orderDir === 'asc'">
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
            <div v-show="item.orderDir === 'desc'">
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
            </div>
        </div>
        <div class="underline"
            :class="item.orderBy === orderKey ? 'font-bold' : ''">
            {{ label }}
        </div>
    </div>
</template>

<script>
    import { defineComponent, ref } from 'vue'

    export default defineComponent({
        
        props: {
            params: Object,
            label: String,
            orderKey: String,
        },

        emits: ['update:params'],

        setup(props){
            const item = ref(props.params);

            function toggle(){
                if(props.orderKey){
                    if(item.value.orderBy !== props.orderKey){
                        item.value.orderBy = props.orderKey;
                    }else{
                        item.value.orderDir = (item.value.orderDir === 'asc') ? 'desc' : 'asc';
                    }
                    this.$emit('update:params', item.value);
                }
            }

            return {
                item,
                toggle,
            }
        }
    })
</script>
