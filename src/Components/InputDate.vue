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
import flatpickr from 'flatpickr'
import flatPickrComp from 'vue-flatpickr-component'
import { French } from 'flatpickr/dist/esm/l10n/fr.js'
import { Spanish } from 'flatpickr/dist/esm/l10n/es.js'
import 'flatpickr/dist/flatpickr.css'

// Langue du calendrier : celle de l'application (vue-i18n) ; semaines commençant le lundi
const LOCALES = {
    fr: French,
    es: Spanish,
    en: { firstDayOfWeek: 1 },
};

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

        /**
         * Using altInput = true is necessary to customize the date display format to the user.
         * It creates an additional input element (the default one is made invisible).
         * Updating config.altInputClass does not update the altInput element !
         * => We trigger the flatpickr update using the component API
         * https://github.com/ankurk91/vue-flatpickr-component/blob/main/src/component.ts
         */

        const fpc = ref(null);
        const app = getCurrentInstance();
        const i18n = app?.appContext.config.globalProperties.$i18n;
        const language = String((typeof i18n?.locale === 'object' ? i18n.locale.value : i18n?.locale) ?? 'en').slice(0, 2);

        const config = ref({
            dateFormat: 'Y-m-d',
            altFormat: 'd F Y',
            altInput: true,
            locale: LOCALES[language] ?? LOCALES.en,
            altInputClass: props.classes,
        });

        watch(() => props.classes, (v) => {
            config.value.altInputClass = v;
            fpc.value.fp = flatpickr(fpc.value.getElem(), fpc.value.config);
        });

        return {
            item,
            fpc,
            config,
        };
    },
})
</script>

<style>
/* Calendrier : panneau blanc arrondi, bordure fine, sélection indigo (même habillage que Dropdown) */
.flatpickr-calendar {
    font-family: inherit;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
.flatpickr-calendar.arrowTop:before,
.flatpickr-calendar.arrowTop:after,
.flatpickr-calendar.arrowBottom:before,
.flatpickr-calendar.arrowBottom:after {
    display: none;
}
.flatpickr-months .flatpickr-month,
.flatpickr-current-month .flatpickr-monthDropdown-months,
.flatpickr-current-month input.cur-year {
    font-weight: 700;
    color: #0f172a;
}
.flatpickr-current-month {
    font-size: 1rem;
}
.flatpickr-months .flatpickr-prev-month:hover svg,
.flatpickr-months .flatpickr-next-month:hover svg {
    fill: #4f46e5;
}
span.flatpickr-weekday {
    font-size: 0.75rem;
    font-weight: 700;
    color: #64748b;
}
.flatpickr-day {
    font-weight: 500;
    color: #0f172a;
    border-radius: 0.375rem;
}
.flatpickr-day:hover,
.flatpickr-day:focus {
    background: #f1f5f9;
    border-color: #f1f5f9;
}
.flatpickr-day.today {
    border-color: #c7d2fe;
}
.flatpickr-day.today:hover {
    background: #eef2ff;
    border-color: #c7d2fe;
    color: #4338ca;
}
.flatpickr-day.selected,
.flatpickr-day.selected:hover,
.flatpickr-day.selected:focus,
.flatpickr-day.startRange,
.flatpickr-day.endRange {
    background: #4f46e5;
    border-color: #4f46e5;
    color: #fff;
    font-weight: 700;
}
.flatpickr-day.prevMonthDay,
.flatpickr-day.nextMonthDay,
.flatpickr-day.flatpickr-disabled {
    color: #94a3b8;
}

/* Mode sombre (par classe) */
.dark .flatpickr-calendar {
    background: #0f172a;
    border-color: #334155;
    box-shadow: none;
}
.dark .flatpickr-months .flatpickr-month,
.dark .flatpickr-current-month .flatpickr-monthDropdown-months,
.dark .flatpickr-current-month input.cur-year,
.dark .flatpickr-day {
    color: #fff;
    fill: #fff;
}
.dark .flatpickr-current-month .flatpickr-monthDropdown-months {
    background: #0f172a;
}
.dark .flatpickr-months .flatpickr-prev-month svg,
.dark .flatpickr-months .flatpickr-next-month svg {
    fill: #cbd5e1;
}
.dark .flatpickr-months .flatpickr-prev-month:hover svg,
.dark .flatpickr-months .flatpickr-next-month:hover svg {
    fill: #818cf8;
}
.dark span.flatpickr-weekday {
    color: #94a3b8;
}
.dark .flatpickr-day:hover,
.dark .flatpickr-day:focus {
    background: #1e293b;
    border-color: #1e293b;
}
.dark .flatpickr-day.today {
    border-color: #3730a3;
}
.dark .flatpickr-day.selected,
.dark .flatpickr-day.selected:hover,
.dark .flatpickr-day.selected:focus {
    background: #818cf8;
    border-color: #818cf8;
    color: #0f172a;
}
.dark .flatpickr-day.prevMonthDay,
.dark .flatpickr-day.nextMonthDay,
.dark .flatpickr-day.flatpickr-disabled {
    color: #475569;
}
</style>
