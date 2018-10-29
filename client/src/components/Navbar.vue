<template lang="pug">

  nav.row-v-center.between
    div(class="control__aside row-v-center")
      i(class="fas fa-bars fa-lg bars-icon")
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
    .nav__user
      .user__image
        img(src="@/assets/images/user.png")
      .user__name Ángel Guerrero

</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/partials/variables.scss';

* {
  // border: 1px solid tomato;
}

nav {
  height: 50px;
  border: 1px solid $border-color;
  &:hover {
    cursor: pointer;
  }
}

.control__aside {
  flex-grow: 1;
}

.bars-icon {
  padding: 10px;
}

.nav__title {
  margin: 0px;
  padding-left: 10px;
}

.nav__user {
  // Display none for mobile
  display: none;
  width: $aside-right-min-w;
  height: 100%;
  background-color: #332c2b;
  color: white;

  .user__image {
    max-width: 45px;
    margin: 1px;
    padding: 3px;
    border: 1px dashed tomato;
    border-radius: 50%;
    img {
      border-radius: 50%;
      width: 100%;
    }
  }

  .user__name {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
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
  .nav__user {
    display: flex;
  }

  .nav__hamburguer {
    display: none;
  }
}
</style>
