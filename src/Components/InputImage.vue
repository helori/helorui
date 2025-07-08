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

        <input
            ref="fileInput"
            type="file"
            :multiple="false"
            :id="'file-input-' + id"
            class="absolute -left-[9999px]"
            @change="setFile"
            :accept="accept">

        <label
            :for="'file-input-' + id"
            class="btn btn-primary">
            <slot name="content">Choisir une image...</slot>
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
        const fileInput = ref(null);
        const id = ref(Math.floor(Math.random()*(9999-1000+1)+1000));
        const selectedFile = ref(props.file);

        watch(() => props.file, (f) => {
            selectedFile.value = f;
        });

        function setFile(e)
        {
            selectedFile.value = e ? e.target.files[0] : null;
            emit('update:file', selectedFile.value);
        }

        return {
            id,
            fileInput,
            selectedFile,
            setFile,
        };
    },
})
</script>
