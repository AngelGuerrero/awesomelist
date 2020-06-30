<template lang="pug">
  aside(:class="getSidebarClasses")

    .backdrop(v-if="mobile" @click="close()")

    div(:class="getSlotClasses")
      slot

</template>

<script>
export default {
  data () {
    return {
      mobile: false
    }
  },

  computed: {
    getSidebarClasses () {
      const clazzes = this.mobile ? 'aside-full' : 'desktop'
      return [
        clazzes
      ]
    },

    getSlotClasses () {
      const clazzes = this.mobile ? 'mobile border shadow' : 'desktop shadow'
      return [
        clazzes
      ]
    }
  },

  created () {
    this.resize()
    window.addEventListener('resize', this.resize)
  },

  methods: {
    close () {
      this.$emit('close')
    },

    resize () {
      this.mobile = window.innerWidth < 800
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/partials/variables.scss';

.aside-full {
  width: 100%;
  height: 100%;
  background-color: lightblue;
}

.mobile {
  position: absolute;
  z-index: 99;
  top: 0;
  right: 0;
  overflow: hidden;
  width: 350px;
  height: 100%;
}

.desktop {
  position: relative;
  width: 350px;
  height: 100%;
  overflow: hidden;
}

.backdrop {
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background:rgba(255, 255, 255, 0.400);
  backdrop-filter: blur(1px);
}
</style>
