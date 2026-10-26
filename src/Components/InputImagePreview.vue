<template>
    <div v-if="image"
        class="flex items-start gap-4 p-3 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">

        <div class="size-36 shrink-0 grow-0 rounded-md border border-slate-200 bg-slate-50 overflow-hidden dark:border-slate-700 dark:bg-slate-800">
            <img v-if="isImage"
                class="size-36 object-contain"
                :src="image.url + '?' + image.decache" />
            <div v-else
                class="size-36 flex flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500">
                <svg class="size-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <span class="text-xs font-bold uppercase">{{ image.extension }}</span>
            </div>
        </div>

        <div class="min-w-0 flex-grow flex flex-col gap-1 items-start text-sm">

            <div class="text-slate-500 dark:text-slate-400">
                <template v-if="isImage">{{ image.width }} × {{ image.height }} px · </template>{{ $filters.octets(image.size) }} · {{ image.mime }}
            </div>
            <div class="text-slate-500 dark:text-slate-400" v-if="showPosition">Position : {{ image.position }}</div>

            <input 
                type="text"
                v-model="image.title"
                class="input w-full"
                placeholder="Titre"
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
            :title="isImage ? 'Supprimer cette image ?' : 'Supprimer ce fichier ?'"
            :button="isImage ? 'Supprimer l\'image' : 'Supprimer le fichier'"
            type="danger"
            max-width-class="max-w-screen-sm"
            :callback="destroy">
            <template #content>
                <p>{{ isImage ? "L'image est supprimée définitivement." : 'Le fichier est supprimé définitivement.' }}</p>
            </template>
        </dialog-form>

    </div>
</template>

<script>

import { defineComponent, ref, onMounted, watch, computed } from 'vue'
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
        const isImage = computed(() => (image.value?.mime ?? '').startsWith('image/'));

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
            isImage,

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
