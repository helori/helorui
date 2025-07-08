<template>
    <div>
        <div class="grid grid-cols-1 gap-2">
            <template v-for="(image, idx) in images">
                <input-image-preview
                    :id="image.id"
                    :endpoint="endpoint" />
            </template>
        </div>

        <div class="mt-2 grid grid-cols-1 gap-2">
            <template v-for="(file, idx) in files">
                <input-image-file-preview
                    :file="file"
                    @unselect="removeFileAt(idx)" />
            </template>
        </div>

        <input
            ref="fileInput"
            type="file"
            :multiple="true"
            :id="'file-input-' + id"
            class="absolute -left-[9999px]"
            @change="addFiles"
            :accept="accept">

        <label
            :for="'file-input-' + id"
            class="btn btn-primary w-full mt-2">
            <slot name="content">Ajouter des images...</slot>
        </label>

    </div>
</template>

<script>

import { defineComponent, ref, watch } from 'vue'
import InputImagePreview from './InputImagePreview.vue'
import InputImageFilePreview from './InputImageFilePreview.vue'

export default defineComponent(
{
    components: {
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
    },

    emits: [
        'update:files',
    ],

    setup(props, { emit })
    {
        const fileInput = ref(null);
        const id = ref(Math.floor(Math.random()*(9999-1000+1)+1000));
        const selectedFiles = ref(props.files ?? []);

        watch(() => props.files, (f) => {
            selectedFiles.value = f ?? [];
        });

        function addFiles(e)
        {
            selectedFiles.value = [...selectedFiles.value, ...e.target.files];
            emit('update:files', selectedFiles.value);
        }

        function removeFileAt(idx)
        {
            selectedFiles.value.splice(idx, 1);
            emit('update:files', selectedFiles.value);
        }

        return {
            id,
            fileInput,
            selectedFiles,
            addFiles,
            removeFileAt,
        };
    },
})
</script>
