//import Vapor from 'laravel-vapor'

export default function()
{
    function asset(url)
    {
        return url;
        //return Vapor.asset(url);
    }

    return {
        asset,
    };
}
