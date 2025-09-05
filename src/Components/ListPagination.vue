<style scoped>
.pagination-link{
    @apply block px-3 py-2 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600;
}
.pagination-link.disabled{
    @apply text-gray-500 hover:bg-white dark:hover:bg-gray-800;
}
.pagination-link:not(.disabled){
    @apply cursor-pointer;
}
.pagination-link.active{
    @apply bg-primary-900 dark:bg-primary-600 text-white border border-primary-900 dark:border-primary-300;
}
</style>

<template>
    <nav aria-label="Page navigation"
        class="my-0"
        v-show="pagination.total > pagination.per_page"
        v-if="pagination !== null">
        <ul class="list-none m-0 flex flex-row dark:text-white">

            <li class="block"
                v-if="pagination.current_page == 1"
                aria-label="Previous">
                <a class="pagination-link disabled rounded-l-md">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>

            <li class="block" v-else>
                <a class="pagination-link rounded-l-md"
                    @click="$event.preventDefault(); setPage(pagination.current_page - 1)"
                    aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>

            <li class="block"
                v-if="pagination.current_page >= 3">
                <a class="pagination-link"
                    @click="$event.preventDefault(); setPage(1)">1</a>
            </li>

            <li class="block"
                v-if="pagination.current_page >= 4">
                <a class="pagination-link disabled"
                    @click="$event.preventDefault()">...</a>
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
                <a class="pagination-link disabled"
                    @click="$event.preventDefault()">...</a>
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
                <a class="pagination-link rounded-r-md disabled">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>

            <li class="block" v-else>
                <a class="pagination-link rounded-r-md"
                    @click="$event.preventDefault(); setPage(pagination.current_page + 1)"
                    aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
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
