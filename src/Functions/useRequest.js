import { ref } from 'vue'

export default function()
{
    const data = ref({});
    const params = ref({});
    const promise = ref(null);
    const status = ref(null);
    const error = ref(null);
    const abortController = ref(null);

    function send(method, url, config, formDataConfig)
    {
        status.value = 'pending';
        error.value = null;

        let requestConfig = {
            method: method,
            url: url,
            data: data.value,
            params: params.value,
        };

        if(config){
            requestConfig = {...requestConfig, ...config};
        }

        if(formDataConfig)
        {
            let formData = new FormData();

            Object.entries(requestConfig.data).forEach(([key, value]) => {
                if(!formDataConfig.ignore || !formDataConfig.ignore.includes(key)){
                    formData.append(key, value);
                }
            });

            if(formDataConfig.files)
            {
                Object.entries(formDataConfig.files).forEach(([collection, collectionFiles]) => {
                    if(Array.isArray(collectionFiles)){
                        collectionFiles.forEach((file, idx) => {
                            formData.append(collection + '-' + idx, file, file.name);
                        });
                    }else if(collectionFiles){
                        let file = collectionFiles;
                        formData.append(collection, file, file.name);
                    }
                });
            }

            if(formDataConfig.fakePut)
            {
                formData.append('_method', 'PUT');
            }

            requestConfig.data = formData;
        }

        abortController.value = new AbortController();
        requestConfig.signal = abortController.value.signal;

        return promise.value = axios.request(requestConfig).then(r => {

            status.value = 'success';
            error.value = null;

            // Needed to call then(r) again on the returned promise
            return r;

        }).catch(r => {

            status.value = 'error';

            // Blob response => should be extracted first !
            if(requestConfig.responseType === 'blob')
            {
                new Response(r.response.data).text().then(rBlob => {
                    error.value = JSON.parse(rBlob);
                });
            }
            else
            {
                error.value = r;
            }

            // 401 : Unauthenticated => redirect
            if (r.response && r.response.status === 401) {
                window.location.reload();
            }

            throw r;
        });
    }

    return {
        data,
        params,
        promise,
        status,
        error,
        send,
        abortController,
    };
}
