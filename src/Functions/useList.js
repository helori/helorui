import { reactive, ref, watchEffect, watch, onMounted, onBeforeUnmount, toRaw, nextTick } from 'vue'
import useRequest from './useRequest.js'

export default function(endpointValue, defaultParams = {}, defaultFilters = {}, storageKeyValue = null)
{
    const endpoint = ref(endpointValue);
    const pagination = ref(null);

    let storageKey = storageKeyValue;
    let initiated = false;

    const readCommonParams = reactive(Object.assign({}, {
        page: 1,
        search: null,
        orderBy: 'id',
        orderDir: 'asc',
        limit: 10,
    }, defaultParams));

    const filters = reactive(Object.assign({}, {}, defaultFilters));

    function resetFilters()
    {
        Object.assign(readCommonParams, {
            page: 1,
            search: null,
            orderBy: 'id',
            orderDir: 'asc',
            limit: 10,
        }, defaultParams);

        Object.assign(filters, defaultFilters);
    }

    function saveToStorage(){
        if(storageKey){
            let data = {
                filters: { ...toRaw(filters) },
                readCommonParams: { ...toRaw(readCommonParams) },
            };
            localStorage.setItem(storageKey, JSON.stringify(toRaw(data)));
        }
    }

    function loadFromStorage(){
        let data = {};
        if(storageKey){
            if(localStorage.getItem(storageKey) !== null){
                data = JSON.parse(localStorage.getItem(storageKey));
                //console.log('loadFromStorage', storageKey, toRaw(data));
            }
        }
        return data;
    }

    function initFromStorage()
    {
        //console.log('=> should init ?', (storageKey != null) && (initiated === false));

        if((storageKey != null) && (initiated === false))
        {
            //console.log('=> init start');

            let data = loadFromStorage();

            if(data.readCommonParams)
            {
                for(const key in data.readCommonParams){
                    readCommonParams[key] = data.readCommonParams[key];
                }
            }

            if(data.filters)
            {
                for(const key in data.filters){
                    filters[key] = data.filters[key];
                }
            }
            //console.log('=> init done', toRaw(readCommonParams), toRaw(filters));
        }
        initiated = true;
    }

    const {
        send: readFunc,
        params: readParams,
        error: readError,
        status: readStatus,
        abortController: readAbortController,
    } = useRequest();

    function read()
    {
        if(!endpoint.value){
            console.log('No endpoint defined for useList, skipping read.');
            return Promise.resolve(null);
        }

        pagination.value = null;

        readParams.value = {
            page: readCommonParams.page,
            search: readCommonParams.search,
            order_by: readCommonParams.orderBy,
            order_dir: readCommonParams.orderDir,
            limit: readCommonParams.limit,
        };

        readParams.value = Object.assign({}, readParams.value, filters);

        //console.log('==> read', JSON.stringify(readParams.value));

        return readFunc('GET', endpoint.value).then(r => {
            pagination.value = r.data;
        });
    }

    // Do not watch changes before next tick (to avoid page reset on initFromStorage)
    nextTick().then(() => {
        watch(() => [
            filters,
            readCommonParams.search,
            readCommonParams.orderBy,
            readCommonParams.orderDir,
            readCommonParams.limit,
        ], () => {
            //console.log('=> Page reset to 1');
            readCommonParams.page = 1;
        }, { deep: true });
    });

    onMounted(() => {
        //console.log('=> onMounted');

        watchEffect((onCleanup) => {
            //console.log('=> watchEffect', toRaw(readCommonParams), toRaw(filters));
            initFromStorage();
            saveToStorage();

            onCleanup(function(){
                if(readAbortController.value){
                    //console.log('=> onCleanup');
                    readAbortController.value.abort();
                }
            });

            read();
        });
    });

    onBeforeUnmount(() => {
        if(storageKey){
            saveToStorage();
        }
    });

    return {
        endpoint,
        pagination,
        readCommonParams,
        filters,
        read,
        readError,
        readStatus,
        resetFilters,
    };
}
