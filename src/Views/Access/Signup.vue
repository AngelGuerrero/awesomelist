<template lang="pug">
div
  formulate-form(@submit='createAccount')
    //- Full name
    fullName-form(
      @passValidation='val => { validations.fullName = val; }',
      @model='fullName => { user.fullName = fullName; }')
    //- Email
    email-form(
      :validateExists='false',
      @passValidation='val => { validations.email = val; }',
      v-model='user.email')

    //- Password with confirmation
    password-form(
      @passValidation='val => { validations.password = val; }',
      @model='password => { user.password = password; }')

    b-button.btn.btn-primary.btn-block.btn-sm.mt-3(
      type='submit',
      variant='primary',
      :disabled='!passedValidations') Crear cuenta
</template>

<script>
import EventBus from '@/EventBus'
import fullNameForm from './Shared/FullNameForm'
import EmailForm from './Shared/EmailForm'
import UsernameForm from './Shared/UsernameForm'
import PasswordForm from './Shared/PasswordForm'

export default {
  components: {
    fullNameForm,
    EmailForm,
    UsernameForm,
    PasswordForm
  },

  data: () => ({
    user: {
      fullName: '',
      email: '',
      password: ''
    },

    validations: {
      fullName: false,
      email: false,
      password: false
    }
  }),

  computed: {
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
    async createAccount () {
      if (!this.passedValidations) return

      const response = await this.$store.dispatch(
        'user/createUserAccount',
        this.user
      )

      if (response.error) {
        EventBus.$emit('on-response', {
          show: true,
          message: response.message,
          error: response.error
        })
      }

      this.$router.replace('dashboard')
    }
  }
}
</script>
