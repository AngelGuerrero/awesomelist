<template lang="pug">
  aside(id="sidebar" :class="getSidebarClasses")
    .backdrop(v-if="sidebar.mobile" @click="close()")

    div(id="sidebar__content"
        :class="getSlotClasses"
        class="animate__animated animate__slideInRight animate__faster")
      slot

</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    mode: {
      type: String,
      // modes:
      // - default
      // - mobile
      // - desktop
      default: 'default',
      required: false
    }
  },

  computed: {
    ...mapState('ui', ['sidebar']),

    getSidebarClasses () {
      const classes = this.sidebar.mobile ? 'aside-full' : 'desktop'
      return [classes]
    },

    getSlotClasses () {
      const classes = this.sidebar.mobile ? 'mobile border shadow' : 'desktop shadow'
      return [classes]
    }
  },

  methods: {
    close () {
      this.addAnimation()
      //
      // Wait until the animation done
      setTimeout(_ => this.$emit('close'), 500)
    },

    addAnimation () {
      const sidebarContent = this.$el.querySelector('#sidebar__content')
      sidebarContent.classList.remove('animate__slideInRight')
      sidebarContent.classList.remove('animate__faster')
      sidebarContent.classList.add('animate__bounceOutRight')
    }
  }
}
</script>

<style lang="scss" scoped>
.aside-full {
  width: 100%;
  height: 100%;
}

.mobile {
  width: 100%;
  position: absolute;
  z-index: 9 !important;
  top: 0;
  right: 0;
  overflow: hidden;
  height: 100%;
  background:#ffffff;
  @media screen and (min-width: 548px) {
    width: 350px;
  }
}

.desktop {
  position: relative;
  width: 350px;
  height: 100%;
  overflow: hidden;
}

.backdrop {
  position: absolute;
  z-index: 8 !important;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background:rgba(255, 255, 255, 0.164);
  backdrop-filter: blur(1px);
  animation: fade 3s;
}
</style>
