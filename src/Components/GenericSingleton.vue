<template>
    <!-- Formulaire long (éditeurs de texte) : une page, et une barre d'enregistrement collée en bas -->
    <div class="min-h-full flex flex-col">

        <div class="flex-grow px-4 py-6 sm:p-8">
            <app-page :title="title">

                <template #description v-if="description">
                    {{ description }}
                </template>

                <request-state :error="readError" :status="readStatus" message="Lecture des réglages…" />

                <app-section v-if="updateData && updateData.id">
                    <generic-form
                        :fields="fields"
                        v-model:model="updateData"
                        v-model:files="updateFiles"
                        @update:model="dirty = true"
                        @update:files="dirty = true"
                        :endpoint="endpoint" />
                </app-section>

            </app-page>
        </div>

        <div class="sticky bottom-0 z-10 px-4 sm:px-8 py-3 border-t border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
            <div class="max-w-3xl flex flex-wrap items-center justify-end gap-3">
                <request-error class="mr-auto" :error="updateError" />
                <span class="text-sm font-medium text-amber-700 dark:text-amber-400"
                    v-if="dirty && updateStatus !== 'pending'">
                    Modifications non enregistrées
                </span>
                <span class="text-sm font-medium text-emerald-700 dark:text-emerald-400"
                    v-else-if="saved">
                    ✓ Enregistré
                </span>
                <request-button
                    class="btn btn-primary"
                    @click="update"
                    :status="updateStatus"
                    :error="updateError">
                    Enregistrer
                </request-button>
            </div>
        </div>

    </div>
</template>

<script>

import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue'
import useRequest from '../Functions/useRequest.js'
import { useI18n } from 'vue-i18n'
import AppPage from './AppPage.vue'
import AppSection from './AppSection.vue'

export default defineComponent({

    components: {
        AppPage,
        AppSection,
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
        // Phrase grise sous le titre : à quoi servent ces réglages
        description: {
            type: String,
            required: false,
            default: '',
        },
    },

    setup(props)
    {
        const fields = ref(props.fields);
        const endpoint = props.endpoint;

        // Modifié depuis la dernière lecture / enregistrement
        const dirty = ref(false);
        const saved = ref(false);

        // ----------------------------------------------------
        //  read
        // ----------------------------------------------------
        const {
            send: readSend,
            status: readStatus,
            error: readError,
        } = useRequest();

        function read()
        {
            return readSend('get', endpoint + '/1').then(r => {
                setItem(r.data);
                dirty.value = false;
            });
        }

        function setItem(item)
        {
            updateData.value = {
                id: item.id,
            };

            updateFiles.value = {};

            fields.value.forEach(field => {
                updateData.value[field.name] = item[field.name];
                if(field.type === 'media' || field.type === 'medias'){
                    updateFiles.value[field.name] = null;
                }
            });
        }

        // Garde-fou : le navigateur prévient avant de fermer l'onglet sur des modifications non enregistrées
        function beforeUnload(e)
        {
            if(dirty.value){
                e.preventDefault();
                e.returnValue = '';
            }
        }

        onMounted(function(){
            read();
            window.addEventListener('beforeunload', beforeUnload);
        })

        onUnmounted(function(){
            window.removeEventListener('beforeunload', beforeUnload);
        })

        const { locale } = useI18n({ useScope: 'global' })

        watch(() => locale.value, (l) => {
            read();
        });

        // ----------------------------------------------------
        //  Update
        // ----------------------------------------------------
        const {
            send: updateSend,
            data: updateData,
            status: updateStatus,
            error: updateError,
        } = useRequest();

        const updateFiles = ref({});

        function update()
        {
            let ignoreFields = ['id'];

            fields.value.forEach(field => {
                if(field.type === 'media' || field.type === 'medias'){
                    ignoreFields.push(field.name);
                }
            });

            let formDataConfig = {
                ignore: ignoreFields,
                fakePut: true,
            };

            if(updateFiles.value){
                formDataConfig.files = {...updateFiles.value};
            }

            return updateSend('post', endpoint + '/' + updateData.value.id, {}, formDataConfig).then(r => {
                saved.value = true;
                return read();
            });
        }

        return {
            fields,
            dirty,
            saved,

            read,
            readStatus,
            readError,

            update,
            updateData,
            updateFiles,
            updateStatus,
            updateError,
        };
    },
})

</script>
