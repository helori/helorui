<template>
    <div v-if="item" class="max-w-2xl space-y-5">

        <template v-for="field in fields" :key="field.name">

            <!-- Case à cocher : son libellé cliquable à droite, l'aide dessous -->
            <div v-if="field.type === 'boolean'">
                <label :for="'field-' + field.name"
                    class="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox"
                        :id="'field-' + field.name"
                        v-model="item[field.name]"
                        @change="update" />
                    <span class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ field.label }}</span>
                </label>
                <p class="field-hint" v-if="field.description">{{ field.description }}</p>
            </div>

            <form-field v-else
                :label="field.label"
                :hint="field.description"
                :input-id="'field-' + field.name"
                v-slot="{ id }">

                <template v-if="field.type === 'media'">
                    <input-image
                        class="w-full"
                        :accept="field.accept"
                        :image="item[field.name]"
                        v-model:file="itemFiles[field.name]"
                        @update:file="update"
                        :endpoint="endpoint + '/' + item.id + '/media'" />
                </template>

                <template v-else-if="field.type === 'medias'">
                    <input-images
                        class="w-full"
                        :accept="field.accept"
                        :images="item[field.name]"
                        v-model:files="itemFiles[field.name]"
                        @update:files="update"
                        :endpoint="endpoint + '/' + item.id + '/media'"
                        :collection="field.name" />
                </template>

                <template v-else-if="field.type === 'select'">
                    <select
                        :id="id"
                        class="input w-full"
                        v-model="item[field.name]"
                        @change="update">
                        <option v-for="opt in field.options"
                            :key="opt.value"
                            :value="opt.value">
                            {{ opt.label }}
                        </option>
                    </select>
                </template>

                <template v-else-if="['text', 'slug'].includes(field.type)">
                    <input type="text"
                        :id="id"
                        class="input w-full"
                        v-model="item[field.name]"
                        @change="update" />
                </template>

                <template v-else-if="field.type === 'email'">
                    <input type="email"
                        :id="id"
                        class="input w-full"
                        autocomplete="email"
                        v-model="item[field.name]"
                        @change="update" />
                </template>

                <template v-else-if="field.type === 'password'">
                    <input type="password"
                        :id="id"
                        class="input w-full"
                        autocomplete="new-password"
                        v-model="item[field.name]"
                        @change="update" />
                </template>

                <template v-else-if="field.type === 'number'">
                    <input type="number"
                        :id="id"
                        class="input w-full sm:w-48"
                        v-model.number="item[field.name]"
                        @change="update" />
                </template>

                <template v-else-if="field.type === 'date'">
                    <input-date
                        :id="id"
                        class="input w-full sm:w-48"
                        v-model:date="item[field.name]"
                        @update:date="update" />
                </template>

                <template v-else-if="field.type === 'time'">
                    <input type="time"
                        :id="id"
                        class="input w-full sm:w-48"
                        v-model="item[field.name]"
                        @change="update" />
                </template>

                <template v-else-if="field.type === 'html'">
                    <editor
                        v-model:html="item[field.name]"
                        @update:html="update" />
                </template>

                <template v-else-if="field.type === 'textarea'">
                    <textarea
                        :id="id"
                        class="input w-full h-48"
                        v-model="item[field.name]"
                        @change="update"></textarea>
                </template>

                <!-- Champ non modifiable : sa valeur, ou un tiret si elle manque -->
                <template v-else>
                    <p class="text-sm font-bold text-slate-900 dark:text-white"
                        v-if="item[field.name] !== null && item[field.name] !== undefined && item[field.name] !== ''">
                        {{ item[field.name] }}
                    </p>
                    <p class="text-sm text-slate-400 dark:text-slate-500" v-else>—</p>
                </template>

            </form-field>

        </template>

    </div>
</template>

<script>

import { defineComponent, ref, watch } from 'vue'
import FormField from './FormField.vue'

export default defineComponent({

    components: {
        FormField,
    },

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
