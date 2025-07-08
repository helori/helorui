import { ref, onMounted, onUnmounted } from 'vue'

export default function()
{
    const isDark = ref(document.documentElement.classList.contains('dark'));

    let observer = new MutationObserver(mutations => {
        for(const m of mutations)
        {
            const newValue = m.target.getAttribute(m.attributeName);
            const classList = newValue ? newValue.split(' ') : [];
            isDark.value = classList.includes('dark');
        }
    });

    onMounted(function(){
        observer.observe(document.documentElement, {
            attributes: true,
            attributeOldValue : true,
            attributeFilter: ['class'],
        });
    });

    onUnmounted(function(){
        observer.disconnect();
    })

    return {
        isDark,
    };
}
