<template lang="pug">
div
  formulate-input#input__email(
    ref='emailInput',
    type='email',
    label='Email',
    placeholder='micorreo@email.com',
    v-model='email',
    :input-class='customClasses.input',
    @keyup='performValidation()',
    @validation='validations = $event',
    validation='bail|required|max:50|email',
    :validation-messages='getValidationMessages',
    :show-errors='showErrors')
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      validations: {},
      showErrors: false,
      email: this.value,

      customClasses: {
        input: ['border-white']
      }
    }
  },

  computed: {
    getValidationMessages () {
      return {
        required: 'El email es requerido.',

        max: context =>
          `El email debe ser un máximo de ${context.args[0]} caracteres.`,

        email: context => `'${context.value}' no es un email válido.`
      }
    }
  },

  watch: {
    value (value) {
      this.email = value
    },
    email (newEmail) {
      this.$emit('input', newEmail)
    },

    validations: {
      immediate: true,
      deep: true,
      handler () {
        this.customClasses.input = []

        if (!this.showErrors) {
          this.customClasses.input.push('border-default')
          this.$emit('passValidation', this.validations.hasErrors === false)
          return
        }

        this.performValidation()
      }
    }
  },

  async mounted () {
    const input = this.$refs.emailInput
    await input.performValidation()
    // Formulate emits only when its error list changes. A valid initial
    // value also needs to notify the parent even when that list stays empty.
    if (this.$refs.emailInput === input) this.validations = { hasErrors: input.hasErrors }
  },

  methods: {
    performValidation () {
      this.customClasses.input = []
      this.showErrors = true

      if (this.validations.hasErrors !== false) {
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
