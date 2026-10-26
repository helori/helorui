<template>
    <div v-if="file"
        class="flex items-start gap-4 p-3 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">

        <div class="size-36 shrink-0 grow-0 rounded-md border border-slate-200 bg-slate-50 overflow-hidden dark:border-slate-700 dark:bg-slate-800">
            <img v-if="isImage"
                class="size-36 object-contain"
                :src="imageSrc"
                @load="onImageLoad" />
            <div v-else
                class="size-36 flex flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500">
                <svg class="size-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <span class="text-xs font-bold uppercase">{{ extension }}</span>
            </div>
        </div>

        <div class="min-w-0 flex flex-col gap-1 items-start text-sm">

            <div class="max-w-full truncate font-bold text-slate-900 dark:text-white">{{ file.name }}</div>
            <div class="text-slate-500 dark:text-slate-400">
                <template v-if="isImage">{{ imageWidth }} × {{ imageHeight }} px · </template>{{ $filters.octets(file.size) }}
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

import { defineComponent, ref, onMounted, watch, computed } from 'vue'

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
        const imageSrc = ref(null);
        const imageWidth = ref(null);
        const imageHeight = ref(null);

        // Les fichiers qui ne sont pas des images n'ont pas de miniature
        const isImage = computed(() => (props.file?.type ?? '').startsWith('image/'));
        const extension = computed(() => (props.file?.name ?? '').split('.').pop());

        function loadImage()
        {
            if(imageSrc.value){
                URL.revokeObjectURL(imageSrc.value);
            }
            imageSrc.value = (props.file && isImage.value) ? URL.createObjectURL(props.file) : null;
        }

        function onImageLoad(e)
        {
            imageWidth.value = e.target.naturalWidth;
            imageHeight.value = e.target.naturalHeight;
        }

        onMounted(function(){
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
            isImage,
            extension,
            onImageLoad,
            imageSrc,
            imageWidth,
            imageHeight,
            emitUnselect,
        };
    },
})
</script>
