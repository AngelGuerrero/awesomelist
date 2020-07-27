<template lang="pug">

  nav(class="row-v-center between")
    div(class="control__aside row-v-center")
      //- icon
      b-button(variant="default" size="sm" class="mx-1")
        b-icon(icon="grid-fill" variant="light")
      //- App title
      h3.nav__title Awesomelist

    //- User links
    .nav__user(class="row-v-center between")
      .nav__link(@click="toggleUserProfileMenu()")
        img(src="@/assets/images/user.png")

</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'Navbar',

  methods: {
    ...mapMutations('ui', ['toggleUserProfileMenu'])
  }
}
</script>

<style lang="scss" scoped>
nav {
  height: $navbar-height;
  background-color: $header_bg_color;
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

  .nav__link {
    max-width: $navbar-height;
    height: $navbar-height;
    padding: 8px;
    &:hover {
      cursor: pointer;
      background-color: darken($header_bg_color, 10%);
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
