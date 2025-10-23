import { ref, provide, onMounted } from 'vue'
import { useI18n } from "vue-i18n"
import useRequest from './useRequest.js'

export default function()
{
    const locales = ref([]);

    const { locale } = useI18n({ useScope: 'global' })

    const backendLocale = ref(window.laravelLocale);

    const {
        send,
        data,
    } = useRequest();

    onMounted(function(){
        send('get', '/api/locales').then(function(r)
        {
            locales.value = r.data;
        });
    });

    function setLocale(l)
    {
        data.value = { locale: l };
        send('post', '/api/locale').then(function(r)
        {
            locale.value = r.data;
            backendLocale.value = r.data;
            window.laravelLocale = r.data;

            // window.location.reload();
            // To avoid reloading the whole page,
            // watch the locale by doing :
            // watch(() => locale.value, (newLocale) => { reload data... });

        });
    }

    provide('setLocale', setLocale);
    provide('locale', locale);
    provide('locales', locales);

    return {
        locales,
        setLocale,
        locale,
        backendLocale,
    };
}
