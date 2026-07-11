<template lang="pug">
div
  formulate-form(@submit='login()')
    //- email
    email-form(
      :validateExists='true',
      v-model='user.email',
      @passValidation='val => { validations.email = val; }')

    //- Password without confirmation
    formulate-input(
      type='password',
      name='password',
      label='Contraseña',
      v-model='user.password',
      placeholder='*******',
      :input-class='customClasses.input',
      @keyup='performPasswordValidations',
      @validation='$e => { passwordValidation = $e; }',
      validation='bail|required|min:6|max:20',
      :validation-messages='getPasswordMessages',
      :show-errors='showPasswordErrors')

    //- Submit
    formulate-input(
      type='submit',
      label='Ingresar',
      input-class='btn btn-primary btn-block btn-sm mt-3',
      :disabled='!passedValidations')
</template>

<script>
import EventBus from '@/EventBus'
import EmailForm from './Shared/EmailForm'

export default {
  components: {
    EmailForm
  },

  data () {
    return {
      validations: {
        email: false,
        password: false
      },

      user: {
        email: '',
        password: ''
      },

      customClasses: {
        input: ['border-default']
      },
      showPasswordErrors: false,
      passwordValidation: {}
    }
  },

  computed: {
    getPasswordMessages () {
      return {
        required: 'La contraseña es requerida.',
        max: context =>
          `La contraseña no debe exceder los ${context.args[0]} caracteres de longitud.`,
        min: context =>
          `La contraseña debe ser mayor a los ${context.args[0]} caracteres de longitud.`
      }
    },

    passedValidations () {
      let returnValue = true

      for (const property in this.validations) {
        //
        // if some property haven't passed the validation
        // then return false
        if (!this.validations[property]) return false
      }

      return returnValue
    }
  },

  methods: {
    performPasswordValidations (e) {
      this.showPasswordErrors = true
      this.customClasses.input = []

      if (this.passwordValidation.hasErrors) {
        this.customClasses.input.push('border-danger')
        this.validations.password = false
      } else {
        this.customClasses.input.push('border-success')
        this.validations.password = true
      }
    },

    async login () {
      if (!this.passedValidations) return

      const response = await this.$store.dispatch(
        'user/signInWithEmailAndPassword',
        {
          email: this.user.email,
          password: this.user.password
        }
      )

      if (response.error) {
        EventBus.$emit('on-response', {
          show: true,
          message: response.message,
          error: true
        })
        return
      }

      this.$router.push({ name: 'dashboard' }).catch(_ => {})
    }
  }
}
</script>
