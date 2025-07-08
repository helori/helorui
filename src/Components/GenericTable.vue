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
                        <template v-for="field in fields">
                            <th v-if="!(field.table === false)">
                                {{ field.label }}
                            </th>
                        </template>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, idx) in pagination.data">
                        <template v-for="field in fields">
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
                    :fields="fields"
                    v-model:model="createDialog.data"
                    v-model:files="createFiles">
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
                    :fields="fields"
                    v-model:model="updateDialog.data"
                    v-model:files="updateFiles">
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
        resource: {
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
    },

    setup(props)
    {
        let resource = window.cms.resources.find(function(r){
            return r.name == props.resource;
        })

        const fields = ref(resource.fields);
        const table = useTable(fields, '/api/admin/resource/' + props.resource, props.orderBy, props.orderDir);

        return {
            fields,
            ...table,
        };
    },
})

</script>
