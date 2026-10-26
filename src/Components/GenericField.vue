<template>
    <!-- Média seul : miniature si c'est une image, sinon son extension en étiquette -->
    <template v-if="field.type === 'media'">
        <template v-if="value">
            <img v-if="isImage(value)"
                class="w-24 h-12 object-contain rounded-md bg-slate-100 dark:bg-slate-800"
                :src="value.url + '?' + value.decache"
                :alt="value.title ?? ''" />
            <span v-else
                class="tag tag-neutral uppercase"
                :title="value.filename">
                {{ value.extension }}
            </span>
        </template>
        <span v-else class="cell-none">—</span>
    </template>

    <div v-else-if="field.type === 'medias'"
        class="flex items-center gap-2">
        <template v-if="value && value.length > 0">
            <img v-if="isImage(value[0])"
                class="w-16 h-12 object-contain rounded-md bg-slate-100 dark:bg-slate-800"
                :src="value[0].url + '?' + value[0].decache"
                :alt="value[0].title ?? ''" />
            <span class="cell-sub">{{ value.length }} {{ value.length > 1 ? 'fichiers' : 'fichier' }}</span>
        </template>
        <span v-else class="cell-none">—</span>
    </div>

    <!-- Un état se dit par une étiquette : field.trueLabel / field.falseLabel (« Publié » / « Non publié ») -->
    <template v-else-if="field.type === 'boolean'">
        <span v-if="value" class="tag tag-success">{{ field.trueLabel ?? 'Oui' }}</span>
        <span v-else class="tag tag-neutral">{{ field.falseLabel ?? 'Non' }}</span>
    </template>

    <template v-else-if="field.type === 'date'">
        <span v-if="value"
            class="tabular-nums whitespace-nowrap"
            :title="$filters.date(value, 'dd/MM/yyyy HH:mm')">
            {{ $filters.date(value) }}
        </span>
        <span v-else class="cell-none">—</span>
    </template>

    <template v-else-if="field.type === 'select'">
        <span v-if="selectLabel !== null">{{ selectLabel }}</span>
        <span v-else class="cell-none">—</span>
    </template>

    <!-- Texte riche : le texte seul, sur deux lignes au plus -->
    <template v-else-if="field.type === 'html'">
        <span v-if="htmlText" class="line-clamp-2 max-w-md whitespace-normal">{{ htmlText }}</span>
        <span v-else class="cell-none">—</span>
    </template>

    <template v-else>
        <span v-if="value !== null && value !== undefined && value !== ''">{{ value }}</span>
        <span v-else class="cell-none">—</span>
    </template>
</template>

<script>

import { defineComponent, computed } from 'vue'

export default defineComponent({

    props: {
        field: {
            required: true,
        },
        item: {
            required: true,
        },
    },

    setup(props)
    {
        const value = computed(() => props.item[props.field.name]);

        // Une valeur absente des options s'affiche telle quelle plutôt que de casser la ligne
        const selectLabel = computed(() => {
            const option = (props.field.options ?? []).find(opt => opt.value == value.value);
            return option ? option.label : (value.value ?? null);
        });

        const htmlText = computed(() => {
            if(!value.value){
                return '';
            }
            // DOMParser ne charge ni n'exécute rien (contrairement à innerHTML : <img onerror>)
            const doc = new DOMParser().parseFromString(value.value, 'text/html');
            return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
        });

        function isImage(media)
        {
            return (media?.mime ?? '').startsWith('image/');
        }

        return {
            value,
            selectLabel,
            htmlText,
            isImage,
        };
    },
})

</script>
