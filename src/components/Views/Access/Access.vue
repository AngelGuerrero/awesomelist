<template lang="pug">
  .access___wrapper(class="min-vh-100 d-flex")
    .app__aside(class="w-50 h-100 d-none d-sm-none d-lg-inline")
      img.aside__img(v-if="background"
                    :src="require('@/assets/images/' + background)"
                    @load="load"
                    class="d-none"
                    alt="Aside background")

    .content(class="h-100 d-flex flex-column")
      .app__header(class="h-25 w-100 d-flex justify-content-center align-items-center")
        h1.app__title(class="h3") awesomelist

      .form__wrapper(class="shadow")
        h4(class="app__title mb-4 text-primary") {{ getData.title }}
        component(:is="component")
        p(class="text-center mt-4") {{ getData.text }}
          |
          router-link(:to="getData.to" class="ml-2") {{ getData.btnText }}

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
      component: null,

      background: null,

      images: ['blue.jpg', 'paint.jpg', 'colors-pattern.jpg', 'rocks.jpg']
    }
  },

  computed: {
    getData () {
      const retval = { title: '', text: '', btnText: '', to: {} }

      switch (this.view) {
        case 'login':
          retval.title = 'Ingresar'
          retval.text = '¿Aún no tienes una cuenta?'
          retval.btnText = 'Registrate'
          retval.to = { path: 'signup', params: { view: 'signup' } }
          break
        case 'signup':
          retval.title = 'Registrarse'
          retval.text = '¿Ya tienes una cuenta?'
          retval.btnText = 'Inicia sesión'
          retval.to = { path: 'login', params: { view: 'login' } }
          break
        default:
          break
      }

      return retval
    }
  },

  watch: {
    view: {
      immediate: true,
      handler (val) {
        this.component = val
      }
    }
  },

  created () {
    this.changeImageBackground()
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
  background: linear-gradient(to top, rgba(255, 0, 0, 0.050),
                                      rgba(28, 255, 244, 0.050),
                                        rgba(0, 128, 0, 0.050),
                                        rgba(255, 255, 0, 0.050),
                                        rgba(0, 81, 255, 0.050),
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
