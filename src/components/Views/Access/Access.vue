<template lang="pug">
  .access___wrapper(class="min-vh-100 d-flex")

    .app__aside(class="w-50 h-100 d-none d-md-inline")

    .content(class="h-100 d-flex flex-column")
      .app__header(class="h-25 w-100 d-flex justify-content-center align-items-center")
        h1.app__title(class="h3") awesomelist

      .form__wrapper(class="shadow")
        h4(class="app__title mb-4 text-primary") {{ getPageTitle }}
        component(:is="component")
        p(class="text-center mt-4") {{ getFooter.text }}
          |
          router-link(:to="getFooter.link" class="ml-2") {{ getFooter.btnText }}

      .credits(class="h-25 d-flex align-items-end")
        .credits__content(class="w-100 p-1 d-flex justify-content-center align-items-center")
          h6.credits__title(class="mb-0 mr-2") By Ángel Guerrero
          span.emoji ⚡
</template>

<script>
import login from './Login'
import signup from './Signup'
export default {
  components: {
    login,
    signup
  },

  props: {
    view: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      components: ['login', 'signup'],

      component: null
    }
  },

  computed: {
    getPageTitle () {
      return this.view === 'login' ? 'Ingresar' : 'Registrarse'
    },

    getFooter () {
      const retval = {
        text: '¿Aún no tienes una cuenta?',
        btnText: 'Registrate',
        link: 'signup'
      }

      if (this.view === 'login') return retval

      retval.text = '¿Ya tienes una cuenta?'
      retval.btnText = 'Inicia sesión'
      retval.link = 'login'

      return retval
    }
  },

  created () {
    this.component = this.view === 'login' ? this.components[0] : this.components[1]
  }
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
  background: linear-gradient(to top, rgba(0, 0, 255, 0.070),
                                        rgba(0, 128, 0, 0.070),
                                        rgba(255, 255, 0, 0.070),
                                        rgba(128, 0, 128, 0.070),
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
  // color: rgb(25, 125, 219);
  color: #818181;
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
