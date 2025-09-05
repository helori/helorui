<template>
    <span class="inline-block relative">

        <input
            ref="fileInput"
            type="file"
            :disabled="disabled"
            :multiple="multiple"
            :id="'file-input-' + id"
            class="file-input absolute"
            style="left: -9999px"
            @change="setFiles"
            :accept="accept">

        <label
            :for="'file-input-' + id"
            class="filedrop m-0 btn btn-primary"
            :class="{
                'disabled': disabled
            }">
            <slot name="content">Choisir un fichier...</slot>
        </label>

    </span>
</template>

<script>

import { defineComponent, ref } from 'vue'

export default defineComponent(
{
    props: {
        multiple: {
            type: Boolean,
            required: false,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        accept: {
            type: String,
            required: false,
            default: '*',
        },
    },

    emits: [
        'files-selected',
    ],

    setup(props, { emit })
    {
        const fileInput = ref(null);
        const id = ref(Math.floor(Math.random()*(9999-1000+1)+1000));

        // -------------------------------------------------------
        //  Init browse button
        // -------------------------------------------------------
        function setFiles(e)
        {
            emit('files-selected', {
                files: e.target.files,
                multiple: props.multiple,
            });
        }

        return {
            id,
            fileInput,
            setFiles,
        };
    },
})
</script>
