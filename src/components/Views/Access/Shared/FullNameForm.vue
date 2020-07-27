<template lang="pug">
  div
    formulate-input(type="text"
                    label="Nombre completo"
                    id="input__fullname"
                    name="fullname"
                    v-model="value"
                    autocomplete="off"
                    @change="performValidation()"

                    :input-class="customClasses.input"

                    @validation="validations = $event"
                    validation-name="Nombre completo"
                    validation="bail|required|min:3|max:60"
                    :validation-messages="getCustomValidationMessages"
                    @error-visibility="showingErrors = $event"
  )
</template>

<script>
export default {
  data: () => ({
    value: '',
    validations: {},
    showingErrors: false,

    customClasses: {
      input: ['border-primary']
    }
  }),

  computed: {
    getCustomValidationMessages () {
      return {
        required: 'El campo es requerido.',
        min: (context) => `El campo debe tener al menos ${context.args[0]} carácteres de longitud.`,
        max: (context) => `El campo debe tener un máximo de ${context.args[0]} de carácteres de longitud.`
      }
    }
  },

  watch: {
    value (val) {
      this.$emit('model', val)
    },

    validations: {
      immediate: true,
      deep: true,
      handler (val) {
        if (!this.showingErrors) {
          this.customClasses.input = []
          this.customClasses.input.push('border-default')
          return
        }

        this.performValidation()
      }
    }
  },

  methods: {
    performValidation () {
      this.customClasses.input = []

      if (this.validations.hasErrors) {
        this.customClasses.input.push('border-danger')
        this.$emit('passValidation', false)
      } else {
        this.customClasses.input.push('border-success')
        this.$emit('passValidation', true)
      }
    }
  }
}
</script>
