<template>
    <div class="absolute inset-0 flex flex-col">

        <div class="p-8 flex-grow overflow-y-scroll">

            <div class="font-bold text-xl mb-8">
                {{ title }}
            </div>

            <generic-form
                :fields="fields"
                v-model:model="updateData"
                v-model:files="updateFiles" />
        </div>

        <div class="px-4 py-2 lg:px-8 border-t flex items-center gap-2 border-gray-300">
            <request-button
                class="btn btn-primary"
                @click="update"
                :status="updateStatus"
                :error="updateError">
                Enregistrer
            </request-button>
            <request-state :error="readError" :status="readStatus" />
            <request-state :error="updateError" :status="updateStatus" />
        </div>

    </div>
</template>

<script>

import { defineComponent, ref, onMounted } from 'vue'
import useRequest from '../Functions/useRequest.js'

export default defineComponent({

    props: {
        user: {
            required: true,
        },
        resource: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: false,
            default: '',
        },
    },

    setup(props)
    {
        let resource = window.cms.resources.find(function(r){
            return r.name == props.resource;
        })

        const fields = ref(resource.fields);

        const endpoint = '/api/admin/resource/' + props.resource;

        // ----------------------------------------------------
        //  read
        // ----------------------------------------------------
        const {
            send: readSend,
            status: readStatus,
            error: readError,
        } = useRequest();

        function read()
        {
            return readSend('get', endpoint + '/1').then(r => {
                setItem(r.data);
            });
        }

        function setItem(item)
        {
            updateData.value = {
                id: item.id,
            };

            updateFiles.value = {};

            fields.value.forEach(field => {
                updateData.value[field.name] = item[field.name];
                if(field.type === 'media' || field.type === 'medias'){
                    updateFiles.value[field.name] = null;
                }
            });
        }

        onMounted(function(){
            read();
        })

        // ----------------------------------------------------
        //  Update
        // ----------------------------------------------------
        const {
            send: updateSend,
            data: updateData,
            status: updateStatus,
            error: updateError,
        } = useRequest();

        const updateFiles = ref({});

        function update()
        {
            let ignoreFields = ['id'];

            fields.value.forEach(field => {
                if(field.type === 'media' || field.type === 'medias'){
                    ignoreFields.push(field.name);
                }
            });

            let formDataConfig = {
                ignore: ignoreFields,
                fakePut: true,
            };

            if(updateFiles.value){
                formDataConfig.files = {...updateFiles.value};
            }

            return updateSend('post', endpoint + '/' + updateData.value.id, {}, formDataConfig).then(r => {
                read();
            });
        }

        return {
            fields,

            read,
            readStatus,
            readError,

            update,
            updateData,
            updateFiles,
            updateStatus,
            updateError,
        };
    },
})

</script>
