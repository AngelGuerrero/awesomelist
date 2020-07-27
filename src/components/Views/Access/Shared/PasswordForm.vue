<template lang="pug">
  div
    formulate-input(type="password"
                    name="password"
                    label="Contraseña"
                    placeholder="*******"
                    :input-class="customClasses.password"
                    @keyup="performPasswordValidations()"
                    @validation="($e) => {passwordValidations = $e}"
                    validation="bail|required|min:6|max:20|matches:/[0-9]/"
                    :validation-messages="getCustomValidationMessages"
                    :show-errors="showPasswordErrors"
    )
    formulate-input(type="password"
                    name="password_confirm"
                    label="Confirmar contraseña"
                    v-model="confirmation"
                    placeholder="*******"
                    :input-class="customClasses.confirmation"
                    @keyup="performConfirmValidations()"
                    @validation="($e) => {confirmValidations = $e}"
                    validation="bail|required|confirm"
                    validation-name="Confirmación de contraseña"
                    :validation-messages="getCustomValidationConfirmMessages"
                    :show-errors="showConfirmationErrors"
    )
</template>

<script>
export default {
  data: () => ({
    confirmation: '',

    passwordValidations: {},
    showPasswordErrors: false,

    confirmValidations: {},
    showConfirmationErrors: false,

    customClasses: {
      password: [],
      confirmation: []
    }
  }),

  computed: {
    getCustomValidationMessages () {
      return {
        required: 'La contraseña es requerida.',
        min: context => `La contraseña debe ser mínimo de ${context.args[0]} carácteres de longitud`,
        matches: 'La contraseña debe contener al menos un número'
      }
    },

    getCustomValidationConfirmMessages () {
      return {
        required: 'Debe confirmar la contraseña.',
        confirm: 'Las contraseñas no coinciden.'
      }
    }
  },

  watch: {
    passwordValidations: {
      immediate: true,
      deep: true,
      handler (val) {
        if (!this.showPasswordErrors) {
          this.setClass('password', 'border-default')
          return
        }

        this.performPasswordValidations()
      }
    },

    confirmValidations: {
      immediate: true,
      deep: true,
      handler (val) {
        if (!this.showConfirmationErrors) {
          this.setClass('confirmation', 'border-default')
          return
        }

        this.performConfirmValidations()
      }
    }
  },

  methods: {
    setClass (property, clazz) {
      this.customClasses[property] = Array.from([])
      this.customClasses[property].push(clazz)
    },

    performPasswordValidations () {
      this.showPasswordErrors = true

      if (this.passwordValidations.hasErrors) {
        this.setClass('password', 'border-danger')
      } else {
        this.setClass('password', 'border-success')
      }
    },

    performConfirmValidations () {
      this.showConfirmationErrors = true

      if (this.confirmValidations.hasErrors || this.passwordValidations.hasErrors) {
        this.setClass('confirmation', 'border-danger')
        this.$emit('passValidation', false)
      } else {
        if (!this.confirmValidations.hasErrors && !this.passwordValidations.hasErrors) {
          this.$emit('passValidation', true)
          this.$emit('model', this.confirmation)
          this.setClass('confirmation', 'border-success')
        }
      }
    }
  }
}
</script>
