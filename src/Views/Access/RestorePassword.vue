<template lang="pug">
div
  formulate-form(@submit='onSubmit')
    //- email
    email-form(
      :validateExists='true',
      v-model='email',
      @passValidation='val => { isValidEmail = val; }')

    //- Submit
    formulate-input(
      type='submit',
      label='Enviar correo de recuperación',
      input-class='btn btn-primary btn-block btn-sm mt-3',
      :disabled='!isValidEmail')
</template>

<script>
import EmailForm from './Shared/EmailForm'
import EventBus from '@/EventBus'

export default {
  name: 'RestorePassword',

  components: {
    EmailForm
  },

  data () {
    return {
      email: '',
      isValidEmail: false
    }
  },

  methods: {
    async onSubmit () {
      const { error, message } = await this.$store.dispatch(
        'user/restorePassword',
        this.email
      )

      EventBus.$emit('on-response', {
        show: true,
        message: message,
        error
      })

      if (!error) {
        setTimeout(() => this.$router.push('/login'), 5000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
