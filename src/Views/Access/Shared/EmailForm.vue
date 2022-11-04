<template lang="pug">
div
  formulate-input#input__email(
    type='email',
    label='Email',
    placeholder='micorreo@email.com',
    v-model='email',
    :input-class='customClasses.input',
    @keyup='performValidation()',
    @validation='validations = $event',
    validation='bail|required|max:50|email|emailExists',
    :validation-rules='getCustomValidationsRules',
    :validation-messages='getValidationMessages',
    :show-errors='showErrors')
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    validateExists: {
      type: Boolean,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },

  data: () => ({
    validations: {},
    showErrors: false,
    customValidations: {
      emailExists: {
        message: ''
      }
    },
    email: '',

    customClasses: {
      input: ['border-white']
    }
  }),

  computed: {
    getCustomValidationsRules () {
      return {
        emailExists: value => this.performEmailValidation(value)
      }
    },

    getValidationMessages () {
      return {
        required: 'El email es requerido.',

        max: context =>
          `El email debe ser un máximo de ${context.args[0]} caracteres.`,

        email: context => `'${context.value}' no es un email válido.`,

        emailExists: this.customValidations.emailExists.message
      }
    }
  },

  watch: {
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
          return
        }

        this.performValidation()
      }
    }
  },

  methods: {
    ...mapActions('user', ['getUserByEmail']),

    performValidation () {
      this.customClasses.input = []
      this.showErrors = true

      if (this.validations.hasErrors) {
        this.customClasses.input.push('border-danger')
        this.$emit('passValidation', false)
      } else {
        this.customClasses.input.push('border-success')
        this.$emit('passValidation', true)
      }
    },

    async performEmailValidation ({ value }) {
      if (this.validations.hasErrors === undefined) return

      let passValidation = false

      const response = await this.getUserByEmail(value)
      const userExists = response.data !== null

      if (this.validateExists) {
        passValidation = userExists

        this.customValidations.emailExists.message = userExists
          ? 'Parece correcto.'
          : 'No existe una cuenta con este email.'
        //
      } else {
        //
        // Validate the email doesn't exist
        passValidation = !userExists

        this.customValidations.emailExists.message = userExists
          ? 'Este email ya está registrado, intenta con otro.'
          : 'Parece correcto.'
      }

      return passValidation
    }
  }
}
</script>
