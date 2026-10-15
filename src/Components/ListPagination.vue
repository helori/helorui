<style scoped>
.pagination-link{
    @apply inline-flex items-center justify-center min-w-[2.25rem] h-9 px-2 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 tabular-nums transition-colors;
}
.pagination-link:not(.disabled):not(.active){
    @apply cursor-pointer hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white;
}
.pagination-link.disabled{
    @apply text-slate-300 dark:text-slate-600;
}
.pagination-link.active{
    @apply bg-primary-600 text-white dark:bg-primary-500;
}
</style>

<template>
    <nav aria-label="Page navigation"
        class="my-0"
        v-show="pagination.total > pagination.per_page"
        v-if="pagination !== null">
        <ul class="list-none m-0 flex flex-row items-center gap-1">

            <li class="block"
                v-if="pagination.current_page == 1"
                aria-label="Previous">
                <a class="pagination-link disabled">
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" /></svg>
                </a>
            </li>

            <li class="block" v-else>
                <a class="pagination-link"
                    @click="$event.preventDefault(); setPage(pagination.current_page - 1)"
                    aria-label="Previous">
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" /></svg>
                </a>
            </li>

            <li class="block"
                v-if="pagination.current_page >= 3">
                <a class="pagination-link"
                    @click="$event.preventDefault(); setPage(1)">1</a>
            </li>

            <li class="block"
                v-if="pagination.current_page >= 4">
                <span class="pagination-link disabled">…</span>
            </li>

            <li class="block"
                v-for="p in pagination.last_page"
                v-show="(p >= (pagination.current_page - 1)) && (p <= (pagination.current_page + 1))">

                <a class="pagination-link"
                    @click="$event.preventDefault(); setPage(p)"
                    v-if="p !== pagination.current_page">{{ p }}</a>
                <a class="pagination-link active"
                    @click="$event.preventDefault()"
                    v-else>{{ p }}</a>
            </li>

            <li class="block"
                v-if="pagination.current_page <= pagination.last_page - 3">
                <span class="pagination-link disabled">…</span>
            </li>

            <li class="block"
                v-if="pagination.current_page <= pagination.last_page - 2">
                <a class="pagination-link"
                    @click="$event.preventDefault(); setPage(pagination.last_page)" >
                    {{ pagination.last_page }}
                </a>
            </li>

            <li class="block"
                v-if="pagination.current_page == pagination.last_page">
                <a class="pagination-link disabled">
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /></svg>
                </a>
            </li>

            <li class="block" v-else>
                <a class="pagination-link"
                    @click="$event.preventDefault(); setPage(pagination.current_page + 1)"
                    aria-label="Next">
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /></svg>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script>

import { defineComponent, ref } from "vue"

export default defineComponent({

    emits: ['update:page'],

    props: {
        page: {
            type: Number,
            required: true,
        },
        pagination: {
            required: true,
        },
    },

    setup(props)
    {
        const item = ref(props.page);

        function setPage(page){
            item.value = page;
            this.$emit('update:page', page);
        }

        return {
            item,
            setPage,
        };
    },
})
</script>
