<template lang="pug">
.access___wrapper.min-vh-100.d-flex
  .app__aside.w-50.h-100.d-none.d-sm-none.d-lg-inline
    img.aside__img.d-none(
      v-if='background',
      :src='require("@/assets/images/" + background)',
      @load='load',
      alt='Aside background')

  .content.h-100.d-flex.flex-column
    .app__header.h-25.w-100.d-flex.justify-content-center.align-items-center
      h1.app__title.h3 awesomelist

    .form__wrapper.shadow
      //- Message alert
      b-alert(
        v-if='response.show',
        show,
        :variant='response.error ? "danger" : "info"') {{ response.message }}

      h4.app__title.mb-4.text-primary {{ getContextualData.title }}

      //- Dynamic component
      component(:is='component')

      router-link.btn.btn-secondary.btn-block.btn-sm.mt-3(
        v-if='hideInRestorePasswordView',
        to='/restore-password') Restablecer contraseña

      //- Contextual information
      p.text-center.mt-4 {{ getContextualData.text }}
        |
        router-link.ml-2(:to='getContextualData.to') {{ getContextualData.btnText }}

    .credits.h-25.d-flex.align-items-end
      .credits__content.w-100.p-1.d-flex.justify-content-center.align-items-center
        h6.credits__title.mb-0.mr-2 By Ángel Guerrero
        span.emoji ⚡
</template>

<script>
import EventBus from '@/EventBus'

const initialResponse = () => ({
  show: false,
  error: false,
  message: ''
})

export default {
  components: {
    login: () => import('./Login'),
    signup: () => import('./Signup'),
    restorePassword: () => import('./RestorePassword')
  },

  props: {
    view: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      //
      // Change the component based in props
      component: null,
      //
      // Verify if the background is loaded
      background: null,
      //
      // Background images
      images: ['blue.jpg', 'paint.jpg', 'colors-pattern.jpg', 'rocks.jpg'],
      //
      // Error messages data
      response: initialResponse()
    }
  },

  computed: {
    getContextualData () {
      const returnValue = { title: '', text: '', btnText: '', to: {} }

      switch (this.view) {
        case 'login':
          returnValue.title = 'Ingresar'
          returnValue.text = '¿Aún no tienes una cuenta?'
          returnValue.btnText = 'Regístrate'
          returnValue.to = { path: 'signup', params: { view: 'signup' } }
          break
        case 'signup':
          returnValue.title = 'Registrarse'
          returnValue.text = '¿Ya tienes una cuenta?'
          returnValue.btnText = 'Inicia sesión'
          returnValue.to = { path: 'login', params: { view: 'login' } }
          break
        case 'restorePassword':
          returnValue.title = 'Restablecer contraseña'
          returnValue.text = ''
          returnValue.btnText = 'Inicia sesión'
          returnValue.to = { path: 'login', params: { view: 'login' } }
          break
        case 'loading':
          returnValue.title = 'Cargando...'
          returnValue.text = ''
          returnValue.btnText = ''
          returnValue.to = {}
          break
        default:
          break
      }

      return returnValue
    },
    hideInRestorePasswordView () {
      return this.view === 'login'
    }
  },

  watch: {
    view: {
      immediate: true,
      handler (val) {
        this.component = val
      }
    },

    'response.show' (newResponseShow) {
      if (!newResponseShow) return

      setTimeout(() => {
        this.response = initialResponse()
      }, 5000)
    }
  },

  created () {
    this.changeImageBackground()

    // Listen responses from child components
    //
    EventBus.$on('on-response', response => {
      this.response = response
    })
  },

  methods: {
    load (e) {
      const asideImg = this.$el.querySelector('.aside__img')
      asideImg.classList.remove('d-none')
      asideImg.classList.remove('animate__fadeOut')

      asideImg.classList.add('animate__animated')
      asideImg.classList.add('animate__fadeIn')
    },

    async changeImageBackground () {
      const removeBackgroundClasses = () => {
        const asideImg = this.$el.querySelector('.aside__img')
        asideImg.classList.remove('animate__fadeIn')
        asideImg.classList.add('animate__fadeOut')
      }

      const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

      for (const image of this.images) {
        this.background = image
        await sleep(30000).then(_ => removeBackgroundClasses())
      }

      await this.changeImageBackground()
    }
  }
}
</script>

<style lang="scss" scoped>
.app__aside {
  background-color: #093e57;
  // background-image: url('~@/assets/images/blue.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transition: all 1s;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.access___wrapper {
  height: 100vh;
  background-position: center;
  background: linear-gradient(
    to top,
    rgba(255, 0, 0, 0.05),
    rgba(28, 255, 244, 0.05),
    rgba(0, 128, 0, 0.05),
    rgba(255, 255, 0, 0.05),
    rgba(0, 81, 255, 0.05)
  );
}

.content {
  width: 100% !important;
  overflow: auto;
  @include media-screen-lg {
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
