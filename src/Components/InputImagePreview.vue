<template>
    <div v-if="image"
        class="flex items-start gap-2 p-3 rounded-md bg-gray-100 dark:bg-gray-700">

        <div class="w-36 h-36 shrink-0 grow-0 bg-white border border-gray-300 overflow-hidden">
            <img class="w-36 h-36 object-contain"
                :src="image.url + '?' + image.decache" />
        </div>

        <div class="flex flex-col gap-1 items-start">

            <div class="">Largeur : {{ image.width }} px</div>
            <div class="">Hauteur : {{ image.height }} px</div>
            <div class="">Type : {{ image.mime }}</div>
            <div class="">Taille : {{ $filters.octets(image.size) }}</div>

            <div class="flex items-center gap-2">
                <button
                    type="button"
                    class="pb-1 border-b-2 text-red-700 dark:text-red-400 border-red-700 dark:border-red-400"
                    @click="destroyOpen">
                    Supprimer
                </button>

                <button
                    type="button"
                    class="pb-1 border-b-2 text-blue-700 dark:text-blue-400 border-blue-700 dark:border-blue-400"
                    @click="download">
                    Télécharger
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
            title="Supprimer l'image"
            button="Supprimer"
            type="danger"
            max-width-class="max-w-screen-sm"
            :callback="destroy">
            <template #content>
                Voulez-vous vraiment supprimer cette image ?
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
    },

    setup(props, { emit })
    {
        let endpoint = '/api/admin/media';

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
            return readSend('get', endpoint + '/' + props.id).then(r => {
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
            return destroyDialog.value.send('delete', endpoint + '/' + props.id).then(r => {
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
            return downloadSend('get', endpoint + '/' + props.id + '/download', { responseType: 'blob' }).then(r => {
                downloadFile(r.data, image.value.filename);
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
        };
    },
})
</script>
