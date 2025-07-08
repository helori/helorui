<template>
    <div class="flex flex-row items-center gap-2"
        v-if="pagination !== null">

        <div v-if="pagination.meta.total > limitValue"
            class="text-sm sm:text-md text-gray-600 dark:text-gray-200 italic">
            <span class="hidden sm:inline">{{ resultsText ?? $t('Results') }}</span>
            {{ (pagination.meta.current_page - 1) * pagination.meta.per_page + 1 }}
            {{ $t('to') }} {{ Math.min(pagination.meta.current_page * pagination.meta.per_page, pagination.meta.total) }}
            / {{ pagination.meta.total }}
        </div>

        <div class="flex-grow"></div>

        <list-pagination
            v-if="pagination !== null"
            :pagination="pagination.meta"
            v-model:page.number="pageValue"
            @update:page="$emit('update:page', pageValue)">
        </list-pagination>

        <select
            v-if="showLimit"
            class="hidden sm:block input w-full sm:w-auto text-sm"
            v-model.number="limitValue"
            @change="$emit('update:limit', limitValue)">
            <option :value="5">5 {{ $t('per page') }}</option>
            <option :value="10">10 {{ $t('per page') }}</option>
            <option :value="20">20 {{ $t('per page') }}</option>
            <option :value="50">50 {{ $t('per page') }}</option>
            <option :value="100">100 {{ $t('per page') }}</option>
        </select>

        <slot></slot>

    </div>
</template>

<script>
    import { defineComponent, ref } from 'vue'
    import ListPagination from './ListPagination.vue'

    export default defineComponent({
        components: {
            ListPagination,
        },

        props: {
            page: {
                type: Number,
                required: true,
            },
            limit: {
                type: Number,
                required: true,
            },
            pagination: {
                required: true,
            },
            resultsText: {
                type: String,
                default: null
            },
            showLimit: {
                type: Boolean,
                default: true,
            },
        },

        emits: [
            'update:page',
            'update:limit',
        ],

        setup(props)
        {
            const limitValue = ref(props.limit);
            const pageValue = ref(props.page);

            return {
                limitValue,
                pageValue,
            }
        }
    })
</script>
