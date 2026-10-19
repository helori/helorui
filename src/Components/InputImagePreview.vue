<template>
    <div v-if="image"
        class="flex items-start gap-4 p-3 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">

        <div class="size-36 shrink-0 grow-0 rounded-md border border-slate-200 bg-slate-50 overflow-hidden dark:border-slate-700 dark:bg-slate-800">
            <img class="size-36 object-contain"
                :src="image.url + '?' + image.decache" />
        </div>

        <div class="min-w-0 flex-grow flex flex-col gap-1 items-start text-sm">

            <div class="text-slate-500 dark:text-slate-400">
                {{ image.width }} × {{ image.height }} px · {{ $filters.octets(image.size) }} · {{ image.mime }}
            </div>
            <div class="text-slate-500 dark:text-slate-400" v-if="showPosition">Position : {{ image.position }}</div>

            <input 
                type="text"
                v-model="image.title"
                class="input w-full"
                placeholder="Titre de l'image"
                @change="rename" />

            <div class="mt-1 flex items-center gap-4">
                <button
                    type="button"
                    class="text-sm font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    @click="download">
                    Télécharger
                </button>

                <button
                    type="button"
                    class="text-sm font-bold text-slate-500 hover:text-red-700 dark:text-slate-400 dark:hover:text-red-400"
                    @click="destroyOpen">
                    Supprimer
                </button>

                <!--button
                    type="button"
                    class="pb-1 border-b-2 text-blue-700 dark:text-blue-400 border-blue-700 dark:border-blue-400"
                    @click="compressOpen">
                    Compresser
                </button>

                <button
                    type="button"
                    class="pb-1 border-b-2 text-blue-700 dark:text-blue-400 border-blue-700 dark:border-blue-400"
                    @click="resizeOpen">
                    Redimensionner
                </button-->
            </div>

        </div>

        <dialog-form
            ref="destroyDialog"
            title="Supprimer cette image ?"
            button="Supprimer l'image"
            type="danger"
            max-width-class="max-w-screen-sm"
            :callback="destroy">
            <template #content>
                <p>L'image est supprimée définitivement.</p>
            </template>
        </dialog-form>

    </div>
</template>

<script>

import { defineComponent, ref, onMounted, watch } from 'vue'
import useRequest from '../Functions/useRequest.js'
import useDownloader from '../Functions/useDownloader.js'

export default defineComponent(
{
    props: {
        id: {
            required: true,
        },
        endpoint: {
            required: true,
        },
        showPosition: {
            type: Boolean,
            default: false,
        },
    },

    setup(props, { emit })
    {
        // ----------------------------------------------------
        //  Read
        // ----------------------------------------------------
        const image = ref(null);

        const {
            send: readSend,
            status: readStatus,
            error: readError,
        } = useRequest();

        function read()
        {
            return readSend('get', props.endpoint + '/' + props.id).then(r => {
                image.value = r.data;
            });
        }

        onMounted(function(){
            read();
        })

        watch(() => props.id, (newId) => {
            read();
        })

        // ----------------------------------------------------
        //  Destroy
        // ----------------------------------------------------
        const destroyDialog = ref(null);

        function destroyOpen()
        {
            destroyDialog.value.open();
        }

        function destroy()
        {
            return destroyDialog.value.send('delete', props.endpoint + '/' + props.id).then(r => {
                destroyDialog.value.close();
                image.value = null;
            });
        }

        // ----------------------------------------------------
        //  Download
        // ----------------------------------------------------
        const {
            send: downloadSend,
            status: downloadStatus,
            error: downloadError,
        } = useRequest();

        const {
            download: downloadFile,
        } = useDownloader();

        function download()
        {
            return downloadSend('get', props.endpoint + '/' + props.id + '/download', { responseType: 'blob' }).then(r => {
                downloadFile(r.data, image.value.filename);
            });
        }

        // ----------------------------------------------------
        //  Rename
        // ----------------------------------------------------
        const {
            send: renameSend,
            status: renameStatus,
            error: renameError,
            data: renameData,
        } = useRequest();

        function rename()
        {
            renameData.value = {
                title: image.value.title,
            };

            return renameSend('put', props.endpoint + '/' + props.id).then(r => {
                read();
            });
        }


        return {
            image,

            readStatus,
            readError,

            destroy,
            destroyDialog,
            destroyOpen,

            download,
            downloadStatus,
            downloadError,

            rename,
            renameStatus,
            renameError,
        };
    },
})
</script>
