<template>
    <div v-if="item" class="max-w-[600px] flex flex-col gap-2">

        <template v-for="field in fields">

            <div v-if="field.label && field.type !== 'boolean'"
                class="font-bold">
                {{ field.label }} :
            </div>

            <div v-if="field.description"
                class="text-gray-500 dark:text-gray-400 text-sm">
                {{ field.description }}
            </div>

            <template v-if="field.type === 'media'">
                <input-image
                    class="mb-2 w-full"
                    :image="item[field.name]"
                    v-model:file="itemFiles[field.name]"
                    @update:file="update"
                    :endpoint="endpoint + '/' + item.id + '/media'" />
            </template>

            <template v-else-if="field.type === 'medias'">
                <input-images
                    class="mb-2 w-full"
                    :images="item[field.name]"
                    v-model:files="itemFiles[field.name]"
                    @update:files="update"
                    :endpoint="endpoint + '/' + item.id + '/media'"
                    :collection="field.name" />
            </template>

            <template v-else-if="field.type === 'select'">
                <select
                    class="input w-full"
                    v-model="item[field.name]"
                    @change="update">
                    <option v-for="opt in field.options"
                        :value="opt.value">
                        {{ opt.label }}
                    </option>
                </select>
            </template>

            <template v-else-if="field.type === 'text'">
                <input type="text"
                    class="input w-full"
                    v-model="item[field.name]"
                    @change="update" />
            </template>

            <template v-else-if="field.type === 'email'">
                <input type="email"
                    class="input w-full"
                    v-model="item[field.name]"
                    @change="update" />
            </template>

            <template v-else-if="field.type === 'slug'">
                <input type="text"
                    class="input w-full"
                    v-model="item[field.name]"
                    @change="update" />
            </template>

            <template v-else-if="field.type === 'password'">
                <input type="password"
                    class="input w-full"
                    v-model="item[field.name]"
                    @change="update" />
            </template>

            <template v-else-if="field.type === 'number'">
                <input type="number"
                    class="input w-full"
                    v-model.number="item[field.name]"
                    @change="update" />
            </template>

            <template v-else-if="field.type === 'date'">
                <input-date
                    class="input w-full"
                    v-model:date="item[field.name]"
                    @update:date="update" />
            </template>

            <template v-else-if="field.type === 'time'">
                <input type="time"
                    class="input w-full"
                    v-model="item[field.name]"
                    @change="update" />
            </template>

            <template v-else-if="field.type === 'html'">
                <editor class=""
                    v-model:html="item[field.name]"
                    @update:html="update" />
            </template>

            <template v-else-if="field.type === 'textarea'">
                <textarea
                    class="input w-full h-48"
                    v-model="item[field.name]"
                    @change="update"></textarea>
            </template>

            <template v-else-if="field.type === 'boolean'">
                <label :for="field.name"
                    class="flex items-center gap-2">
                    <input type="checkbox"
                        :id="field.name"
                        v-model="item[field.name]"
                        @change="update" />
                    <div class="font-bold">
                        {{ field.label }}
                    </div>
                </label>
            </template>

            <template v-else>
                {{ item[field.name] }}
            </template>

        </template>

    </div>
</template>

<script>

import { defineComponent, ref, watch } from 'vue'

export default defineComponent({

    emits: [
        'update:model',
        'update:files',
    ],

    props: {
        model: {
            required: true,
        },
        files: {
            required: false,
        },
        fields: {
            required: true,
        },
        endpoint: {
            type: String,
            required: false,
        },
    },

    setup(props, { emit })
    {
        const item = ref({...props.model});
        const itemFiles = ref({...props.files});

        watch(() => props.model, (value) => {
            item.value = {...value};
        }, {deep: true})

        watch(() => props.files, (value) => {
            itemFiles.value = {...value};
        }, {deep: true})

        function update()
        {
            emit('update:model', item.value);
            emit('update:files', itemFiles.value);
        }

        return {
            item,
            itemFiles,
            update,
        }
    }
})
</script>
