<template lang="pug">
  .wrapper(class="border shadow h-100 d-flex flex-column" :class="{ 'wrapper--fixed': isFixed }")
    //- Toggle button set aside
    div.w-100
      b-button(variant="light" @click="isFixed = !isFixed")
        b-icon(v-if="isFixed" variant="primary" icon="toggle-on")
        b-icon(v-else class="text-muted" icon="toggle-off")

    .menu__header(class="h-50")
      //- Header: Mi día
      .item_button__container
        b-button(block variant="light" class="d-flex row-v-center")
          b-icon(variant="danger" icon="brightness-high" class="h5 mb-0 mr-3 p-0")
          div(class="w-100 text-left")
            span.text-small Mi día
      //- Header: Importante
      .item_button__container
        b-button(block variant="light" class="d-flex row-v-center")
          b-icon(variant="warning" icon="star" class="h5 mb-0 mr-3 p-0")
          div(class="w-100 text-left")
            span.text-small Importante
      //- Header: Tareas
      .item_button__container
        b-button(block variant="light" class="d-flex row-v-center")
          b-icon(variant="primary" icon="list-task" class="h5 mb-0 mr-3 p-0")
          div(class="w-100 text-left")
            span.text-small Tareas

    //- Content: Proyectos
    .menu__content.h-50

    //- Footer
    .menu__footer
      .item_button__container(class="d-flex row-v-center bg-white")
        b-icon(variant="primary" icon="box" class="h3 my-0 ml-2 pl-1 mr-3")
        b-input(type="text" placeholder="Nombre de la colección" class="bg-white border-0 dev")

      .item_button__container
        b-button(block variant="light" class="d-flex row-v-center")
          b-icon(variant="primary" icon="plus" class="h5 mb-0 mr-3 p-0")
          div(class="w-100 text-left")
            span.text-small Nueva colleción
</template>

<script>
export default {
  data () {
    return {
      isFixed: true
    }
  },

  methods: {
  }
}
</script>

<style lang="scss" scoped>
//
// Variables
@import '@/assets/scss/partials/variables.scss';
$wrapper-min-width: 45px;
$wrapper-max-width: 200px;

.wrapper {
  min-width: $wrapper-min-width;
  max-width: $wrapper-max-width;
  width: $wrapper-min-width;

  transition: all 0.5s;
  background-color: $sidebar-bg-color;
  overflow: hidden;

  &:hover {
    width: $wrapper-max-width;
  }

  @media screen and (max-width: 648px) {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }
}

.wrapper--fixed {
  width: $wrapper-max-width;
}

.menu__header {
  overflow: hidden;
  &:hover {
    overflow-x: hidden;
    overflow-y: auto;
  }
}

.item_button__container {
  overflow: hidden;
  width: $wrapper-max-width;
  input[type="text"] {
    outline: none !important;
    box-shadow: none !important;
    font-size: 12px;
    &::placeholder {
      text-align: left;
      font-size: 12px;
    }
  }
}

.text-small {
  font-size: 13px !important;
}

.list_item__container {
  width: $wrapper-max-width;
  overflow: hidden;
}
</style>
