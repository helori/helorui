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


    // ------------------------------------------------
    //  Load user
    // ------------------------------------------------
    const user = ref(null);

    const {
        send: userSend,
        status: userStatus,
        error: userError,
    } = useRequest();

    async function refreshUser()
    {
        await userSend('get', '/api/user').then(r => {
            user.value = r.data;
        }).catch(r => {
            // Prevent showing error in console if user is not logged in
        });
    }

    onMounted(refreshUser);

    provide('refreshUser', refreshUser);

    // ------------------------------------------------
    //  Login
    // ------------------------------------------------
    const {
        send: loginSend,
        status: loginStatus,
        error: loginError,
        data: loginData,
    } = useRequest();

    function login(email, password)
    {
        loginData.value = {
            email: email,
            password: password,
        };

        return loginSend('POST', '/login').then(r => {
            refreshUser();
        });
    }

    provide('login', login);
    provide('loginStatus', loginStatus);
    provide('loginError', loginError);

    // ------------------------------------------------
    //  Logout
    // ------------------------------------------------
    const {
        send: logoutSend,
        status: logoutStatus,
        error: logoutError,
    } = useRequest();

    function logout()
    {
        return logoutSend('POST', '/logout').then(() => {
            user.value = null;
            //window.location.href = '/';
        });
    }

    provide('logout', logout);

    return {
        user,
        login,
        logout,
    }
}
