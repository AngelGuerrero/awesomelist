<template lang="pug">
  #app(class="column between")
    navbar
    #main
      .main__content
        to-do
    #footer By Ángel Guerrero
</template>

<script>
import Navbar from './components/Layout/Navbar'
import Sidebar from './components/Layout/Sidebar'

import ToDo from './components/ToDo/ToDo'

export default {
  components: {
    Navbar,
    Sidebar,
    ToDo
  }
}
</script>

<style lang="scss">
// Global styles
@import '@/assets/scss/main.scss';

#app {
  height: 100vh;
}

#main {
  overflow: hidden;
  height: calc(100vh - #{$navbar-height} - #{$footer-padding });
  display: flex;
}

.main__content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

#footer {
  padding: $footer-padding 0px;
  text-align: center;
  color: #ffffff;
  background-color: $header_bg_color;
}
</style>
