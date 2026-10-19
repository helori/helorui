<template>
    <div class="flex flex-col gap-2">

        <div v-if="file">
            <input-image-file-preview
                :file="file"
                @unselect="setFile(null)" />
        </div>

        <div v-else-if="image">
            <input-image-preview
                :id="image.id"
                :endpoint="endpoint" />
        </div>

        <div>
            <input-file
                :accept="accept"
                :multiple="false"
                @files-selected="e => setFile(e.files[0] ?? null)">
                <template #content>
                    <slot name="content">{{ (file || image) ? "Remplacer l'image…" : 'Choisir une image…' }}</slot>
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

export default defineComponent(
{
    components: {
        InputImagePreview,
        InputImageFilePreview,
        InputFile,
    },

    props: {
        file: {

        },
        accept: {
            type: String,
            required: false,
            default: 'image/*',
        },
        image: {
            required: false,
        },
        endpoint: {
            type: String,
            required: true,
        },
    },

    emits: [
        'update:file',
    ],

    setup(props, { emit })
    {
        const selectedFile = ref(props.file);

        watch(() => props.file, (f) => {
            selectedFile.value = f;
        });

        function setFile(file)
        {
            selectedFile.value = file ?? null;
            emit('update:file', selectedFile.value);
        }

        return {
            selectedFile,
            setFile,
        };
    },
})
</script>
