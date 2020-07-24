<template lang="pug">
  div
    formulate-form
      //- Full name
      formulate-input(type="text"
                      label="Nombre completo"
                      placeholder="Santiago Guerrero"
                      )
      //- Username
      username-form
      //- Email
      email-form
      //- Password with confirmation
      password-form
      formulate-input(type="submit"
                      label="Enviar"
                      input-class="btn btn-primary btn-block btn-sm mt-3"
                      )
</template>

<script>
import EmailForm from './Shared/EmailForm'
import UsernameForm from './Shared/UsernameForm'
import PasswordForm from './Shared/PasswordForm'

export default {
  components: {
    EmailForm,
    UsernameForm,
    PasswordForm
  }
}
</script>
