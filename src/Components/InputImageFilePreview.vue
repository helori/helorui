<template>
    <div v-if="file"
        class="flex items-start gap-4 p-3 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">

        <div class="size-36 shrink-0 grow-0 rounded-md border border-slate-200 bg-slate-50 overflow-hidden dark:border-slate-700 dark:bg-slate-800">
            <img class="size-36 object-contain"
                :src="imageSrc"
                ref="imageElt" />
        </div>

        <div class="min-w-0 flex flex-col gap-1 items-start text-sm">

            <div class="max-w-full truncate font-bold text-slate-900 dark:text-white">{{ file.name }}</div>
            <div class="text-slate-500 dark:text-slate-400">
                {{ imageWidth }} × {{ imageHeight }} px · {{ $filters.octets(file.size) }}
            </div>
            <div class="text-slate-500 dark:text-slate-400">{{ file.type }}</div>

            <button
                type="button"
                class="mt-2 text-sm font-bold text-slate-500 hover:text-red-700 dark:text-slate-400 dark:hover:text-red-400"
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
