<template lang="pug">

  nav(class="row-v-center between")
    div(class="control__aside row-v-center")
      b-button(variant="default" size="sm" class="mx-1")
        b-icon(icon="grid-fill" variant="light")
      h3.nav__title Awesomelist
    .nav__user(class="row-v-center between " @click="changeAsideRight()")
      .user__image
        img(src="@/assets/images/wendy.jpg")

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
      console.log('Emitiendo evento...')
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
  color: white;
  margin: 0px;
  padding-left: 10px;
  font-size: 1.2rem;
  font-weight: 400;
}

.nav__user {
  // Display none for mobile
  display: flex;
  height: $navbar-height;

  .user__image {
    max-width: $navbar-height;
    height: $navbar-height;
    padding: 8px;
    &:hover {
      cursor: pointer;
      background-color: darken($wrapper-header-background-color, 10%);
    }
    img {
      border-radius: 50%;
      width: 100%;
      height: auto;
    }
  }
}

.more__icon {
  transform: rotate(90deg);
  padding: 10px;
  &:hover {
    cursor: pointer;
  }
}

@media screen and (min-width: 800px) {
}
</style>
