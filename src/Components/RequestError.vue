<template>
    <alert type="danger" v-if="error">

        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <!-- Erreurs de validation : une ligne, ou une liste quand il y en a plusieurs -->
        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <template v-if="validationErrors.length">
            <div v-if="validationErrors.length === 1 || firstErrorOnly">
                {{ validationErrors[0] }}
            </div>
            <ul v-else class="list-disc pl-4 space-y-0.5">
                <li v-for="(err, index) in validationErrors" :key="index">
                    {{ err }}
                </li>
            </ul>
        </template>

        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <!-- Message du serveur, ou message générique selon l'erreur -->
        <!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -->
        <div v-else-if="message">
            {{ message.generic ? $t(message.text) : message.text }}
        </div>

    </alert>
</template>

<script>
    import { defineComponent, computed } from 'vue'
    import Alert from './Alert.vue'

    // Messages génériques de Laravel et d'axios, traduits par l'application hôte.
    // Tout autre message vient de l'application elle-même et s'affiche tel quel.
    const GENERIC_MESSAGES = [
        'Network Error',
        'Server Error',
        'Unauthenticated.',
        'This action is unauthorized.',
        'Not Found',
        'Too Many Attempts.',
        'Service Unavailable',
        'Page Expired',
        'CSRF token mismatch.',
    ];

    export default defineComponent({
        components: {
            Alert
        },
        props: {
            error: {
                required: true
            },
            firstErrorOnly: {
                type: Boolean,
                default: false,
                required: false,
            }
        },

        setup(props)
        {
            const validationErrors = computed(() => {
                const errors = props.error?.response?.data?.errors;
                return errors ? Object.values(errors).flat() : [];
            });

            const message = computed(() => {
                const text = props.error?.response?.data?.message || props.error?.message;
                if(!text){
                    return null;
                }
                // « Request failed with status code 500 » : axios, sans rien venant du serveur
                if(/^Request failed with status code/.test(text)){
                    const byStatus = { 401: 'Unauthenticated.', 403: 'This action is unauthorized.', 404: 'Not Found', 419: 'Page Expired', 429: 'Too Many Attempts.', 503: 'Service Unavailable' };
                    return { text: byStatus[props.error?.response?.status] ?? 'Server Error', generic: true };
                }
                return { text, generic: GENERIC_MESSAGES.includes(text) };
            });

            return {
                validationErrors,
                message,
            };
        }
    })
</script>
