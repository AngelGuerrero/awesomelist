<template lang="pug">
  #app
    router-view.main__content
</template>

<script></script>

<style lang="scss">
#app {
  // height: 100vh;
}

#main {
  // overflow: hidden;
  // height: calc(100vh - #{$navbar-height} - #{$footer-padding });
  // display: flex;
}

.main__content {
  // width: 100%;
  // height: 100%;
  // overflow: hidden;
  // position: relative;
}

#footer {
  padding: $footer-padding 0px;
  text-align: center;
  color: #ffffff;
  background-color: $header_bg_color;
}
</style>
