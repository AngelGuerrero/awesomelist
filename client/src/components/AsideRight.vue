<template lang="pug">
  aside.aside__right(class="column between" v-show="visible")
    .column.grow-1
      header.row
        i.icon-close(class="symb-icon fas fa-times fa-lg row-v-center")
        h3.title(class="grow-1 row-h-center") Aprender Erlang

      .duetime(class="container row-v-center")
        .duetime__content(class="grow-1")
          .duetime__title Due time
          .duetime__time
            p December 24, 2018

        el-dropdown
          i.el-icon-more(class="row-v-center")
          el-dropdown-menu(slot="dropdown")
            el-dropdown-item set Due Time
            el-dropdown-item Notifications

      .description(class="container")
        .description__title Aprender Erlang
        .description__content
          p Estoy aprendiendo Erlang y es genial

    .section
      el-button(type="danger") Eliminar tarea

</template>

<script>
export default {
  name: 'AsideRight',

  props: {
    // Validate if the component
    // will be show it
    visible: {
      type: Boolean,
      required: true
    },

    // It is the size accord to the device
    size: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/partials/variables.scss';

* {
  // border: 1px solid tomato;
}

.aside__right {
  width: $aside-right-width;
  max-width: $aside-right-min-w;
  padding: 5px;
  background-color: white;
  overflow-y: auto;
}

.container {
  padding: 10px;
  margin: 10px 0px;
  border: 1px solid #333333;
  border-radius: 5px;
  text-align: center;
}

.duetime {
  .duetime__time {
    color: orangered;
  }

  .el-icon-more {
    transform: rotate(90deg);
    height: 15px;
    padding: 10px;
    &:hover {
      cursor: pointer;
    }
  }
}

button {
  width: 100%;
}
</style>
