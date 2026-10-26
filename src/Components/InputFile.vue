<template>
    <!-- Le champ est dans le bouton : il reste joignable au clavier et le focus se voit -->
    <label
        class="filedrop m-0 inline-flex items-center gap-2 cursor-pointer focus-within:ring-2 focus-within:ring-primary-300 dark:focus-within:ring-primary-700"
        :class="[buttonClasses, { 'disabled opacity-50 !cursor-not-allowed': disabled }]">

        <input
            ref="fileInput"
            type="file"
            class="file-input sr-only"
            :disabled="disabled"
            :multiple="multiple"
            :accept="accept"
            @change="setFiles">

        <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>

        <span>
            <slot name="content">Choisir un fichier…</slot>
        </span>

    </label>
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
        // Chaîne vide : tous les types de fichiers sont acceptés
        accept: {
            type: String,
            required: false,
            default: '',
        },
        // Choisir un fichier accompagne le formulaire : bouton secondaire par défaut
        buttonClasses: {
            default: 'btn btn-white',
        },
    },

    emits: [
        'files-selected',
    ],

    setup(props, { emit })
    {
        const fileInput = ref(null);

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
            fileInput,
            setFiles,
        };
    },
})
</script>
