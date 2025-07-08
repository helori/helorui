<template>
    <div v-if="file"
        class="flex items-start gap-2 p-3 rounded-md bg-gray-100 dark:bg-gray-700">

        <div class="w-36 h-36 shrink-0 grow-0 bg-white border border-gray-300 overflow-hidden">
            <img class="w-36 h-36 object-contain"
                :src="imageSrc"
                ref="imageElt" />
        </div>

        <div class="flex flex-col gap-1 items-start">

            <div class="font-bold">Fichier : {{ file.name }}</div>
            <div class="">Largeur : {{ imageWidth }} px</div>
            <div class="">Hauteur : {{ imageHeight }} px</div>
            <div class="">Type : {{ file.type }}</div>
            <div class="">Taille : {{ $filters.octets(file.size) }}</div>

            <button
                type="button"
                class="pb-1 border-b-2 text-red-700 dark:text-red-400 border-red-700 dark:border-red-400"
                @click="emitUnselect">
                Annuler la sélection
            </button>
        </div>

    </div>
</template>

<script>

import { defineComponent, ref, onMounted, watch } from 'vue'

export default defineComponent(
{
    props: {
        file: {
            required: false,
        },
    },

    emits: [
        'unselect',
    ],

    setup(props, { emit })
    {
        let imageElt = ref(null);
        const imageSrc = ref(null);
        const imageWidth = ref(null);
        const imageHeight = ref(null);

        function loadImage()
        {
            imageSrc.value = props.file ? URL.createObjectURL(props.file) : null;
        }

        onMounted(function(){
            imageElt.value.onload = function(){
                imageWidth.value = imageElt.value.width;
                imageHeight.value = imageElt.value.height;
            }
            loadImage();
        })

        watch(() => props.file, () => {
            loadImage();
        })

        function emitUnselect()
        {
            emit('unselect');
        }

        return {
            imageElt,
            imageSrc,
            imageWidth,
            imageHeight,
            emitUnselect,
        };
    },
})
</script>
