<template>
    <div>
        <!-- Libellé au-dessus, en gras, sans majuscules ni deux-points -->
        <label :for="id"
            class="field-label"
            v-if="label || $slots.label">
            <slot name="label">{{ label }}</slot>
        </label>

        <!-- Le champ reçoit l'id du libellé : <form-field v-slot="{ id }"><input :id="id"></form-field> -->
        <slot :id="id"></slot>

        <p class="field-hint"
            v-if="hint || $slots.hint">
            <slot name="hint">{{ hint }}</slot>
        </p>
    </div>
</template>

<script>
    import { defineComponent } from 'vue'

    export default defineComponent({
        props: {
            label: {
                type: String,
                default: '',
            },
            // Aide sous le champ
            hint: {
                type: String,
                default: '',
            },
            inputId: {
                type: String,
                default: '',
            },
        },

        setup(props)
        {
            const id = props.inputId || 'field-' + Math.random().toString(36).substring(2, 11);

            return {
                id,
            };
        },
    })
</script>
