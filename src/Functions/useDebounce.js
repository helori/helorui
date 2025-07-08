export default function()
{
    let debounceTimer = null;

    function debounce(callback, milliseconds)
    {
        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(function(){
            callback()
        }, milliseconds);
    }

    return {
        debounce
    };
}
