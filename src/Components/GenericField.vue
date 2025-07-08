<template>
    <div v-if="field.type === 'media'"
        class="w-24 h-12 bg-gray-100">
        <img v-if="item[field.name]"
            class="w-24 h-12 object-contain"
            :src="item[field.name].url + '?' + item[field.name].decache" />
    </div>

    <div v-else-if="field.type === 'medias'"
        class="flex flex-col gap-1 items-center">
        <img v-if="item[field.name].length > 0"
            class="w-24 h-16 object-contain bg-gray-100"
            :src="item[field.name][0].url + '?' + item[field.name][0].decache" />
        <div class="text-center text-xs">
            {{ item[field.name].length }} images
        </div>
    </div>

    <div v-else-if="field.type === 'boolean'">
        <boolean-icon :value="item[field.name]" />
    </div>

    <div v-else-if="field.type === 'date'">
        {{ $filters.date(item[field.name]) }}
    </div>

    <div v-else-if="field.type === 'select'">
        {{ field.options.find(opt => { return opt.value == item[field.name] }).label }}
    </div>

    <div v-else-if="field.type === 'html'"
        v-html="item[field.name]"
        class="text-xs">
    </div>

    <div v-else>
        {{ item[field.name] }}
    </div>
</template>

<script>

import { defineComponent } from 'vue'

export default defineComponent({

    props: {
        field: {
            required: true,
        },
        item: {
            required: true,
        },
    },
})

</script>
