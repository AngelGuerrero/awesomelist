<template lang="pug">
  .access___wrapper(class="min-vh-100 d-flex")

    .app__aside(class="w-50 h-100 d-none d-md-inline")

    .content(class="h-100 d-flex flex-column")
      .app__header(class="h-25 w-100 d-flex justify-content-center align-items-center")
        h1.app__title(class="h3") awesomelist

      .form__wrapper(class="shadow")
        h4(class="app__title mb-4 text-dark") Ingresar
        formulate-form
          formulate-input(type="text"
                          id="form__username"
                          name="username"
                          label="Nombre de usuario o email"
                          label-class="text-muted"
                          input-class="form-control form-control-sm"
                          placeholder="micorreo@email.com"
                          )
          formulate-input(type="password"
                          name="password"
                          label="Contraseña"
                          label-class="text-muted"
                          placeholder="*******"
                          input-class="form-control form-control-sm"
                          outer-class="mt-3"
                          )
          formulate-input(type="submit"
                          id="btn--submit"
                          label="Ingresar"
                          input-class="btn btn-primary btn-block btn-sm mt-3"
                          )
        p(class="text-center mt-4") ¿Aún no tienes una cuenta?
          |
          a(href="#")  Registrate

      .credits(class="h-25 d-flex align-items-end")
        .credits__content(class="w-100 p-1 d-flex justify-content-center align-items-center")
          h6.credits__title(class="mb-0 mr-2") By Ángel Guerrero
          span.emoji ⚡

    //- formulate-form(class="needs-validation")
      //- formulate-input(type="text"
                      name="username"
                      label="Nombre de usuario"
                      label-class="text-primary"
                      help="Text help"
                      help-class="text-muted"
                      validation="required"
                      :validation-messages="getFormMessages"
                      outer-class="border mb-3"
                      input-class="w-100 rounded"
                      error-class="text-danger")

      //- formulate-input(type="submit"
                      input-class="btn btn-dark"
                      label="enviar")
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.app__aside {
  background-image: url('~@/assets/images/blue.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.access___wrapper {
  height: 100vh;
  background-position: center;
  background: linear-gradient(to top, rgba(0, 0, 255, 0.040),
                                        rgba(0, 128, 0, 0.040),
                                        rgba(255, 255, 0, 0.040),
                                        rgba(128, 0, 128, 0.040),
                                        );
}

.content {
  width: 100% !important;
  @include media-screen-md {
    width: 50% !important;
  }
}

.form__wrapper {
  width: 80%;
  padding: 25px 20px;
  margin: auto;
  background-color: white;
  @include media-screen-md {
    max-width: 500px;
  }
}

#form__username {
  @include media-screen-md {
    max-width: 500px;
  }
}

.app__title {
  color: $header_bg_color;
  color: rgb(25, 125, 219);
  font-family: 'Poppins', sans-serif;
}

.credits {
  &__content {
    background-color: rgba(255, 255, 255, 0.445);
  }
  &__title {
    font-family: 'Poppins', sans-serif;
    font-size: 12px;
  }

  .emoji {
    font-size: 20px;
    color: rgb(226, 222, 0);
  }
}
</style>
