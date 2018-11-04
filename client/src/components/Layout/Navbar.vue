<template lang="pug">

  nav.row-v-center.between
    div(class="control__aside row-v-center")
      i(class="fas fa-bars fa-lg bars-icon"
        @click="changeAsideLeft()"
      )
      h3.nav__title Project name
    .nav__hamburguer
      el-dropdown
        i.el-icon-more.more__icon
        el-dropdown-menu(slot="dropdown")
          el-dropdown-item Username
          el-dropdown-item Settings
          el-dropdown-item Projects
          el-dropdown-item Project properties
          el-dropdown-item Logout
    .nav__user(class="row-v-center between" @click="changeAsideRight()")
      .user__image
        img(src="@/assets/images/wendy.jpg")
      .user__name(class="grow-1 row-v-center row-h-center") Ángel Guerrero

</template>

<script>
import EventBus from '@/EventBus'

export default {
  name: 'Navbar',

  methods: {
    // Emit events for change the components visibility, through EventBus
    changeAsideLeft () {
      EventBus.$emit('change-aside-left-state')
    },

    changeAsideRight () {
      EventBus.$emit('change-aside-right-state')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/partials/variables.scss';

nav {
  height: $navbar-height;
  background-color: $wrapper-header-background-color;
  color: white;

  & p, i, li {
    color: white;
  }
}

.control__aside {
  flex-grow: 1;
}

.bars-icon {
  padding: 10px;
  &:hover {
    cursor: pointer;
  }
}

.nav__title {
  margin: 0px;
  padding-left: 10px;
}

.nav__user {
  // Display none for mobile
  display: none;
  width: $aside-right-width;
  height: $navbar-height;
  background-color: darken($color: $wrapper-header-background-color, $amount: 20);
  color: white;

  &:hover {
    cursor: pointer;
    background-color: lighten($wrapper-header-background-color, 20%);
  }

  .user__image {
    max-width: $navbar-height;
    height: $navbar-height;
    border: 1px dashed tomato;
    border-radius: 50%;
    overflow: hidden;
    background-color: black;
  }
}

img {
  // border-radius: 50%;
  width: 100%;
  height: auto;
}

.more__icon {
  transform: rotate(90deg);
  padding: 10px;
  &:hover {
    cursor: pointer;
  }
}

@media screen and (min-width: 800px) {
  .nav__user {
    display: flex;
  }

  .nav__hamburguer {
    display: none;
  }
}
</style>
