<template lang="pug">
  div
    formulate-form(@submit="createAccount")
      //- Full name
      fullname-form(@passValidation="val => {validations.fullname = val}"
                    @model="fullname => {user.fullname = fullname }")
      //- Email
      email-form(:validateExistance="false"
                @passValidation="val => {validations.email = val} "
                @model="email => {user.email = email}")

      //- Password with confirmation
      password-form(@passValidation="val => {validations.password = val}"
                    @model="password => {user.password = password}")

      b-button(type="submit"
              variant="primary"
              class="btn btn-primary btn-block btn-sm mt-3"
              :disabled="!passedValidations"
              ) Crear cuenta
</template>

<script>
import EventBus from '@/EventBus'
import FullnameForm from './Shared/FullNameForm'
import EmailForm from './Shared/EmailForm'
import UsernameForm from './Shared/UsernameForm'
import PasswordForm from './Shared/PasswordForm'

export default {
  components: {
    FullnameForm,
    EmailForm,
    UsernameForm,
    PasswordForm
  },

  data: () => ({
    user: {
      fullname: '',
      email: '',
      password: ''
    },

    validations: {
      fullname: false,
      email: false,
      password: false
    }
  }),

  computed: {
    passedValidations () {
      let retval = true

      for (const property in this.validations) {
        //
        // if some property haven't passed the validation
        // then return false
        if (!this.validations[property]) return false
      }

      return retval
    }
  },

  methods: {
    async createAccount () {
      if (!this.passedValidations) return

      const getval = await this.$store.dispatch('user/createUserAccount', this.user)

      if (getval.error) {
        EventBus.$emit('on-response', {
          show: true,
          message: getval.message,
          error: getval.error
        })
      }

      this.$router.replace('dashboard')
    }
  }
}
</script>
