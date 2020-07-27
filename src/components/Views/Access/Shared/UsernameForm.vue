<template lang="pug">
  div
    pre {{ $data }}
    formulate-input(
      type="text"
      name="username"
      id="input__username"
      label="Nombre de usuario"

      :input-class="(context, classes) => customClasses.input.concat(classes)"

      @validation="performValidation($event)"
      validation="bail|required|min:5|max:10|userExists"
      :validation-rules="getValidationRules"
      :validation-messages="getValidationMessages"
      error-behavior="live"
    )
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      validations: {},

      customValidations: {
        userExists: {
          error: false,
          message: ''
        }
      },

      customClasses: {
        input: []
      }
    }
  },

  computed: {
    getValidationRules () {
      return {
        userExists: (value) => this.ifUserExists(value)
      }
    },

    getValidationMessages () {
      return {
        required: 'El nombre de usuario es requerido',

        min: (context) => {
          return `El nombre debe de tener un mínimo de ${context.args[0]} carácteres`
        },

        max: (context) => {
          return `El nombre de usuario debe tener un máximo de ${context.args[0]} carácteres`
        },

        userExists: this.customValidations.userExists.message
      }
    }
  },

  watch: {
    validations: {
      immediate: true,
      deep: true,
      handler (newval) {
        if (newval.hasErrors === undefined) return

        const that = this
        const toggleClass = (newclass) => {
          that.customClasses.input = Array.from([])
          that.customClasses.input.push(newclass)
        }

        newval.hasErrors
          ? toggleClass('border-danger')
          : toggleClass('border-success')
      }
    }
  },

  methods: {
    ...mapActions('user', ['getUserByNickName']),

    ifUserExists ({ value }) {
      const user = value

      console.log(user)
      console.log(`buscando usuario: ${user}`)

      const getval = this.getUserByNickName(user)

      console.log(getval)

      if (getval.error) {
        console.log(`Something went wrong: ${getval.message}`)
        return
      }

      this.customValidations.userExists.message = 'El usuario no existe'
      return true
    },

    performValidation (e) {
      this.validations = e
    }
  }
}
</script>

<style lang="scss">
$error-color: rgb(255, 71, 71);

.errors-class {
  padding: 0;
  list-style-type: none;
  color: $error-color;
}
</style>
