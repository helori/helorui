import { ref, provide, onMounted } from 'vue'
import { useRequest } from './useRequest'

export default function()
{
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
