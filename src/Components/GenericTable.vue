<template>
    <div class="absolute inset-0 flex flex-col p-8">

        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <!-- Header -->
        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <list-header
            class="mb-4"
            :title="title"
            :has-search="true"
            v-model:search="readCommonParams.search">

            <request-state :error="reorderError" :status="reorderStatus" />

            <button
                v-if="canCreate"
                type="button"
                @click="openCreate"
                class="btn btn-primary">
                Nouveau...
            </button>

        </list-header>

        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <!-- Body -->
        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <div class="table-wrapper text-sm overflow-y-scroll"
            v-if="pagination !== null">
            <table>
                <thead>
                    <tr>
                        <template v-for="field in fields.filter(f => f.table !== false)">
                            <th v-if="!(field.table === false)">
                                <table-sort-label
                                    v-if="field.sortable === true"
                                    :params="readCommonParams"
                                    :order-key="field.name"
                                    :label="field.label" />
                                <div v-else>
                                    {{ field.label }}
                                </div>
                            </th>
                        </template>
                        <th v-if="orderableBy">
                            <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                            </svg>
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, idx) in pagination.data"
                        :key="item.id"
                        :draggable="orderableBy ? true : false"
                        @dragstart="drag($event, item[orderableBy])"
                        @drop="drop($event, item[orderableBy])"
                        @dragover.prevent
                        @dragenter.prevent>
                        <template v-for="field in fields.filter(f => f.table !== false)">
                            <td v-if="field.table !== false">

                                <template v-if="Array.isArray(field.table)">
                                    <div v-for="tableCellField in field.table"
                                        :class="tableCellField.class">
                                        <generic-field
                                            :field="tableCellField"
                                            :item="item" />
                                    </div>
                                </template>

                                <template v-else>
                                    <generic-field
                                        :field="field"
                                        :item="item" />
                                </template>

                            </td>
                        </template>
                        <td v-if="orderableBy">
                            {{ item[orderableBy] }}
                        </td>
                        <td>
                            <div class="flex items-center justify-end gap-2">
                                <button
                                    v-if="canUpdate"
                                    type="button"
                                    @click="openUpdate(item)"
                                    class="btn btn-white">
                                    Modifier
                                </button>

                                <button
                                    v-if="canDelete"
                                    type="button"
                                    @click="openDestroy(item)"
                                    class="btn btn-red">
                                    Supprimer
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <!-- Footer -->
        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <list-footer
            class="mt-4"
            :pagination="pagination"
            v-model:limit="readCommonParams.limit"
            v-model:page="readCommonParams.page">
        </list-footer>

        <request-state :error="readError" :status="readStatus" class="mt-4" />

        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <!-- Dialogs -->
        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <dialog-form
            ref="createDialog"
            title="Ajouter"
            button="Enregistrer"
            max-width-class="max-w-screen-md"
            :callback="create">
            <template #content>
                <generic-form
                    :fields="fields.filter(f => f.editable !== false)"
                    v-model:model="createDialog.data"
                    v-model:files="createFiles"
                    :endpoint="endpoint">
                </generic-form>
            </template>
        </dialog-form>

        <dialog-form
            ref="updateDialog"
            title="Modifier"
            button="Enregistrer"
            max-width-class="max-w-screen-md"
            :callback="update">
            <template #content>
                <generic-form
                    :fields="fields.filter(f => f.editable !== false)"
                    v-model:model="updateDialog.data"
                    v-model:files="updateFiles"
                    :endpoint="endpoint">
                </generic-form>
            </template>
        </dialog-form>

        <dialog-form
            ref="destroyDialog"
            title="Supprimer"
            button="Supprimer"
            type="danger"
            max-width-class="max-w-screen-sm"
            :callback="destroy">
            <template #content>
                Voulez-vous vraiment effectuer cette action ?
            </template>
        </dialog-form>

    </div>
</template>

<script>

import { defineComponent, ref } from 'vue'
import useTable from '../Functions/useTable.js'
import GenericField from './GenericField.vue'

export default defineComponent({

    components: {
        GenericField,
    },

    props: {
        user: {
            required: true,
        },
        fields: {
            required: true,
        },
        endpoint: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: false,
            default: '',
        },
        orderBy: {
            type: String,
            required: false,
            default: 'id',
        },
        orderDir: {
            type: String,
            required: false,
            default: 'desc',
        },
        orderableBy: {
            type: String,
            nullable: true,
            required: false,
            default: null,
        },
        canCreate: {
            type: Boolean,
            required: false,
            default: true,
        },
        canUpdate: {
            type: Boolean,
            required: false,
            default: true,
        },
        canDelete: {
            type: Boolean,
            required: false,
            default: true,
        },
        storageKey: {
            type: String,
            required: false,
            default: null,
        },
    },

    setup(props)
    {
        const fields = ref(props.fields);

        const table = useTable(
            fields,
            props.endpoint,
            props.orderBy,
            props.orderDir,
            props.storageKey,
            props.orderableBy,
        );

        return {
            fields,
            ...table,
        };
    },
})

</script>
