<template lang="pug">
#app
  router-view.main__content
</template>

<script>
export default {
  name: 'App',

  data () {
    return {
      msg: 'Welcome to Your Vue.js App',

      preDev: {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  height: 100vh;
}
</style>
