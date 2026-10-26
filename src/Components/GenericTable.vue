<template>
    <div class="px-4 py-6 sm:p-8">
        <app-page :title="title" wide>

            <template #description v-if="description">
                {{ description }}
            </template>

            <template #actions v-if="canCreate">
                <button
                    type="button"
                    @click="openCreate"
                    class="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {{ createTitle }}
                </button>
            </template>

            <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
            <!-- Recherche -->
            <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
            <list-header
                :has-search="true"
                v-model:search="readCommonParams.search">
                <request-state :error="reorderError" :status="reorderStatus" message="Enregistrement de l'ordre…" />
            </list-header>

            <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
            <!-- Liste -->
            <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
            <div class="table-wrapper"
                v-if="pagination !== null">
                <table>
                    <thead>
                        <tr>
                            <th v-for="field in tableFields"
                                :key="field.name"
                                :class="{'!text-right': field.type === 'number'}">
                                <table-sort-label
                                    v-if="field.sortable === true"
                                    :params="readCommonParams"
                                    :order-key="field.name"
                                    :label="field.label" />
                                <template v-else>
                                    {{ field.label }}
                                </template>
                            </th>
                            <th v-if="orderableBy" class="w-px">
                                <span class="sr-only">Ordre</span>
                            </th>
                            <th v-if="canUpdate || canDelete" class="w-px">
                                <span class="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- La ligne ouvre la modification ; les icônes à droite restent les actions rapides -->
                        <tr v-for="item in pagination.data"
                            :key="item.id"
                            :class="{'cursor-pointer': canUpdate}"
                            :draggable="orderableBy ? true : false"
                            @click="canUpdate && openUpdateFor(item)"
                            @dragstart="drag($event, item[orderableBy])"
                            @drop="drop($event, item[orderableBy])"
                            @dragover.prevent
                            @dragenter.prevent>

                            <td v-for="field in tableFields"
                                :key="field.name"
                                :class="[field.type === 'number' ? 'cell-num' : '', field.class ?? '']">

                                <template v-if="Array.isArray(field.table)">
                                    <div v-for="tableCellField in field.table"
                                        :key="tableCellField.name"
                                        :class="tableCellField.class">
                                        <generic-field
                                            :field="tableCellField"
                                            :item="item" />
                                    </div>
                                </template>

                                <generic-field v-else
                                    :field="field"
                                    :item="item" />
                            </td>

                            <td v-if="orderableBy"
                                class="cell-num">
                                <span class="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500 cursor-grab"
                                    title="Glisser la ligne pour changer l'ordre">
                                    <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                                    </svg>
                                    {{ item[orderableBy] }}
                                </span>
                            </td>

                            <td v-if="canUpdate || canDelete">
                                <div class="cell-actions">
                                    <button
                                        v-if="canUpdate"
                                        type="button"
                                        class="btn-icon"
                                        :title="'Modifier « ' + itemName(item) + ' »'"
                                        @click.stop="openUpdateFor(item)">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </button>

                                    <button
                                        v-if="canDelete"
                                        type="button"
                                        class="btn-icon btn-icon-danger"
                                        :title="'Supprimer « ' + itemName(item) + ' »'"
                                        @click.stop="openDestroyFor(item)">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="pagination.data.length === 0">
                            <td class="cell-empty" :colspan="columnCount">
                                <template v-if="readCommonParams.search">
                                    Aucun résultat pour « {{ readCommonParams.search }} ».
                                </template>
                                <template v-else>
                                    Aucun élément pour l'instant.
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Chargement : dire ce qu'on lit, et l'erreur s'il y en a une -->
            <request-state :error="readError" :status="readStatus" message="Lecture de la liste…" />

            <list-footer
                :pagination="pagination"
                v-model:limit="readCommonParams.limit"
                v-model:page="readCommonParams.page">
            </list-footer>

        </app-page>

        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <!-- Popups -->
        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <dialog-form
            ref="createDialog"
            :title="createTitle"
            button="Ajouter"
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
            :title="'Modifier « ' + currentName + ' »'"
            button="Enregistrer les modifications"
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
            :title="'Supprimer « ' + currentName + ' » ?'"
            button="Supprimer"
            type="danger"
            max-width-class="max-w-screen-sm"
            :callback="destroy">
            <template #content>
                <p>La suppression de <strong>{{ currentName }}</strong> est définitive.</p>
            </template>
        </dialog-form>

    </div>
</template>

<script>

import { defineComponent, ref, computed } from 'vue'
import useTable from '../Functions/useTable.js'
import GenericField from './GenericField.vue'
import AppPage from './AppPage.vue'

export default defineComponent({

    components: {
        GenericField,
        AppPage,
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
        // Phrase grise sous le titre : ce que contient la liste
        description: {
            type: String,
            required: false,
            default: '',
        },
        // Bouton et titre de la popup de création : « Nouvelle version », « Ajouter un partenaire »
        createLabel: {
            type: String,
            required: false,
            default: null,
        },
        // Champ qui nomme un élément dans les infobulles et les popups (par défaut le premier champ texte)
        itemLabel: {
            type: String,
            required: false,
            default: null,
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

        const tableFields = computed(() => fields.value.filter(f => f.table !== false));

        const columnCount = computed(() => tableFields.value.length
            + (props.orderableBy ? 1 : 0)
            + ((props.canUpdate || props.canDelete) ? 1 : 0));

        const createTitle = computed(() => props.createLabel ?? 'Ajouter');

        const labelField = computed(() => props.itemLabel
            ?? fields.value.find(f => f.type === 'text')?.name
            ?? null);

        function itemName(item)
        {
            const name = labelField.value ? item[labelField.value] : null;
            return name ? String(name) : 'n° ' + item.id;
        }

        // Nom de l'élément ouvert dans une popup
        const currentName = ref('');

        function openUpdateFor(item)
        {
            currentName.value = itemName(item);
            table.openUpdate(item);
        }

        function openDestroyFor(item)
        {
            currentName.value = itemName(item);
            table.openDestroy(item);
        }

        return {
            fields,
            ...table,
            tableFields,
            columnCount,
            createTitle,
            itemName,
            currentName,
            openUpdateFor,
            openDestroyFor,
        };
    },
})

</script>
