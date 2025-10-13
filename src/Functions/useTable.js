import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import useList from './useList.js'

export default function(fields, endpoint, orderBy, orderDir, storageKey = null)
{
    const {
        pagination,
        readCommonParams,
        filters,
        read,
        readStatus,
        readError,
    } = useList(endpoint, {
        orderBy: orderBy ?? 'created_at',
        orderDir: orderDir ?? 'desc',
        limit: 10,
    });

    const { locale } = useI18n({ useScope: 'global' })

    watch(() => locale.value, (l) => {
        read();
    });

    // ----------------------------------------------------
    //  Create
    // ----------------------------------------------------
    const createDialog = ref(null);
    const createFiles = ref({});

    function openCreate()
    {
        createDialog.value.data = {};

        fields.value.forEach(field => {
            createDialog.value.data[field.name] = field.default ?? null;
            if(field.type === 'media' || field.type === 'medias'){
                createFiles.value[field.name] = null;
            }
        });

        createDialog.value.open();
    }

    function create()
    {
        let ignoreFields = [];

        fields.value.forEach(field => {
            if(field.type === 'media' || field.type === 'medias'){
                ignoreFields.push(field.name);
            }
        });

        let formDataConfig = {
            ignore: ignoreFields,
            fakePut: false,
        };

        if(createFiles.value){
            formDataConfig.files = {...createFiles.value};
        }

        return createDialog.value.send('post', endpoint, {}, formDataConfig).then(r => {
            createDialog.value.close();
            read();
        });
    }

    // ----------------------------------------------------
    //  Update
    // ----------------------------------------------------
    const updateDialog = ref(null);
    const updateFiles = ref({});

    function openUpdate(item)
    {
        updateDialog.value.data = {
            id: item.id,
        };

        updateFiles.value = {};

        fields.value.forEach(field => {
            updateDialog.value.data[field.name] = item[field.name];
            if(field.type === 'media' || field.type === 'medias'){
                updateFiles.value[field.name] = null;
            }
        });

        updateDialog.value.open();
    }

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

        return updateDialog.value.send('post', endpoint + '/' + updateDialog.value.data.id, {}, formDataConfig).then(r => {
            updateDialog.value.close();
            read();
        });
    }

    // ----------------------------------------------------
    //  Destroy
    // ----------------------------------------------------
    const destroyDialog = ref(null);

    function openDestroy(item)
    {
        destroyDialog.value.data = {
            id: item.id,
        };
        destroyDialog.value.open();
    }

    function destroy()
    {
        return destroyDialog.value.send('delete', endpoint + '/' + destroyDialog.value.data.id).then(r => {
            destroyDialog.value.close();
            read();
        });
    }

    return {
        pagination,
        readCommonParams,
        filters,
        read,
        readStatus,
        readError,

        create,
        createFiles,
        createDialog,
        openCreate,

        update,
        updateFiles,
        updateDialog,
        openUpdate,

        destroy,
        destroyDialog,
        openDestroy,
    };
}
