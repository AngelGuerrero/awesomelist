<template lang="pug">
  div
    formulate-form
      //- Username or email
      username-form
      //- Password without confirmation
      password-form
      //- Submit
      formulate-input(
        type="submit"
        label="Ingresar"
        input-class="btn btn-primary btn-block btn-sm mt-3"
      )
</template>

<script>
import UsernameForm from './Shared/UsernameForm'
import PasswordForm from './Shared/PasswordForm'

export default {
  components: {
    UsernameForm,
    PasswordForm
  }
}
</script>
