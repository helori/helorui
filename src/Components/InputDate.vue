<template>
    <flat-pickr-comp
        ref="fpc"
        :class="classes"
        v-model="item"
        :config="config"
        :placeholder="placeholder" />
</template>

<script>

import { defineComponent, ref, watch, getCurrentInstance } from 'vue'
import flatPickrComp from 'vue-flatpickr-component'
/*import { english } from 'flatpickr/dist/l10n/default.js'
import { French } from 'flatpickr/dist/l10n/fr.js'
import { Spanish } from 'flatpickr/dist/l10n/es.js'*/
import 'flatpickr/dist/flatpickr.css'

export default defineComponent(
{
    components: {
        flatPickrComp,
    },

    props: {
        date: {
            required: true,
            default: null
        },
        placeholder: {
            required: false,
            default: null,
        },
        classes: {
            default: 'input',
        },
    },

    emits: [
        'update:date',
    ],

    setup(props, context)
    {
        const item = ref(props.date);

        watch(() => props.date, (newDate) => {
            item.value = newDate;
        });

        watch(() => item.value, (newDate) => {
            context.emit('update:date', item.value);
        });

        /*const datesLocales = ref({
            en: english,
            fr: French,
            es: Spanish,
        })

        datesLocales.value['en'].firstDayOfWeek = 1;
        datesLocales.value['fr'].firstDayOfWeek = 1;
        datesLocales.value['es'].firstDayOfWeek = 1;*/

        /**
         * Using altInput = true is necessary to customize the date display format to the user.
         * It creates an additional input element (the default one is made invisible).
         * Updating config.altInputClass does not update the altInput element !
         * => We trigger the flatpickr update using the component API
         * https://github.com/ankurk91/vue-flatpickr-component/blob/main/src/component.ts
         */

        const fpc = ref(null);
        const app = getCurrentInstance();

        const config = ref({
            dateFormat: 'Y-m-d',
            altFormat: 'd F Y',
            altInput: true,
            //locale: datesLocales.value[app.appContext.config.globalProperties.$i18n.locale],
            altInputClass: props.classes,
        });

        watch(() => props.classes, (v) => {
            config.value.altInputClass = v;
            fpc.value.fp = flatpickr(fpc.value.getElem(), fpc.value.config);
        });

        return {
            item,
            //datesLocales,
            fpc,
            config,
        };
    },
})
</script>
