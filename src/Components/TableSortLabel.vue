<template>
    <div class="group flex flex-row justify-start items-center gap-1 cursor-pointer select-none"
        :class="item.orderBy === orderKey ? 'text-slate-900 dark:text-white' : 'hover:text-slate-900 dark:hover:text-white'"
        @click="toggle">
        <div>{{ label }}</div>
        <svg v-if="item.orderBy !== orderKey" class="w-4 h-4 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.53 3.47a.75.75 0 0 0-1.06 0L6.22 6.72a.75.75 0 0 0 1.06 1.06L10 5.06l2.72 2.72a.75.75 0 1 0 1.06-1.06l-3.25-3.25Zm-4.31 9.81 3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06L10 14.94l-2.72-2.72a.75.75 0 0 0-1.06 1.06Z" clip-rule="evenodd" />
        </svg>
        <svg v-else-if="item.orderDir === 'asc'" class="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
        </svg>
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
