<template>
    <div>
        
        <div class="grid grid-cols-1 gap-2">
            <template v-for="(image, idx) in localImages">
                <input-image-preview
                    :id="image.id"
                    :endpoint="endpoint"
                    :show-position="true"
                    :draggable="true"
                    @dragstart="drag($event, image.position)"
                    @drop="drop($event, image.position)"
                    @dragover.prevent
                    @dragenter.prevent />
            </template>
        </div>

        <div class="mt-2 grid grid-cols-1 gap-2">
            <template v-for="(file, idx) in files">
                <input-image-file-preview
                    :file="file"
                    @unselect="removeFileAt(idx)" />
            </template>
        </div>

        <div class="mt-2">
            <input-file
                :accept="accept"
                :multiple="true"
                @files-selected="e => addFiles(e.files)">
                <template #content>
                    <slot name="content">{{ accept === 'image/*' ? 'Ajouter des images…' : 'Ajouter des fichiers…' }}</slot>
                </template>
            </input-file>
        </div>

    </div>
</template>

<script>

import { defineComponent, ref, watch } from 'vue'
import InputImagePreview from './InputImagePreview.vue'
import InputImageFilePreview from './InputImageFilePreview.vue'
import InputFile from './InputFile.vue'
import useRequest from '../Functions/useRequest.js'

export default defineComponent(
{
    components: {
        InputFile,
        InputImagePreview,
        InputImageFilePreview,
    },

    props: {
        files: {

        },
        accept: {
            type: String,
            required: false,
            default: 'image/*',
        },
        images: {
            required: false,
        },
        endpoint: {
            type: String,
            required: true,
        },
        collection: {
            type: String,
            required: false,
            nullable: true,
            default: null,
        },
    },

    emits: [
        'update:files',
        'reordered',
    ],

    setup(props, { emit })
    {
        const localImages = ref([...(props.images ?? [])]);

        const selectedFiles = ref(props.files ?? []);

        watch(() => props.files, (f) => {
            selectedFiles.value = f ?? [];
        });

        function addFiles(files)
        {
            selectedFiles.value = [...selectedFiles.value, ...files];
            emit('update:files', selectedFiles.value);
        }

        function removeFileAt(idx)
        {
            selectedFiles.value.splice(idx, 1);
            emit('update:files', selectedFiles.value);
        }

        // ----------------------------------------------------
        //  Reorder
        // ----------------------------------------------------
        let dragPosition = null;
        let dropPosition = null;

        function drag(event, position)
        {
            dragPosition = position;
        }

        function drop(event, position)
        {
            event.preventDefault();
            dropPosition = position;

            reorder();

            dragPosition = null;
            dropPosition = null;
        }

        const {
            send: reorderSend,
            status: reorderStatus,
            error: reorderError,
            data: reorderData,
        } = useRequest();

        function reorder()
        {
            reorderData.value = {
                collection: props.collection,
                from_position: dragPosition,
                to_position: dropPosition,
            };

            return reorderSend('post', props.endpoint + '/reorder').then(r => {
                emit('reordered');
                read();
            });
        }

        const {
            send: readSend,
            status: readStatus,
            error: readError,
            params: readParams,
        } = useRequest();

        function read()
        {
            readParams.value = {
                collection: props.collection,
                limit: 0,
            };

            // Just to refresh the images after reorder
            return readSend('get', props.endpoint).then(r => {
                localImages.value = r.data;
                console.log(r.data);
            });
        }

        return {
            localImages,
            selectedFiles,
            addFiles,
            removeFileAt,
            drag,
            drop,
            reorderStatus,
            reorderError,
        };
    },
})
</script>
