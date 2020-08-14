<template lang="pug">
  #toDoToolsWrapper
    #tools
      //- Select items
      .section(:class="{ 'option-active': moveToDoToList.active }"
              @click="toggleMoveToDoListActive")
        b-icon(icon="card-checklist" class="section__icon h3")
        p Modo seleccionar

      //- Filter
      .section.option-active
        b-icon(icon="filter" class="section__icon h3")
        p Filtrar

      //- Search
      .section
        b-icon(icon="search" class="section__icon h3")
        p Buscar
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState('ui', [
      'moveToDoToList'
    ])
  },

  methods: {
    ...mapMutations('ui', [
      'toggleMoveToDoListActive'
    ])
  }
}
</script>

<style lang="scss" scoped>
#toDoToolsWrapper {
  // Mobile
  // display: none;
  position: fixed;
  top: $navbar-height;
  left: 0;
  z-index: 9;

  width: 100%;
  height: 100%;
  background-color: white;

  // Laptop
  @include media-screen-md {
    width: 400px;
    height: auto;
    border: 1px solid rgba(241, 241, 241, 0.753);
    border-top: none;
    box-shadow:   0 2.8px 2.2px rgba(0, 0, 0, 0.034),
  0 6.7px 5.3px rgba(0, 0, 0, 0.048),
  0 12.5px 10px rgba(0, 0, 0, 0.06),
  0 22.3px 17.9px rgba(0, 0, 0, 0.072),
  0 41.8px 33.4px rgba(0, 0, 0, 0.086),
  0 100px 80px rgba(0, 0, 0, 0.12);
  }

  // LG
  @include media-screen-lg {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    border: none;
    box-shadow: none;
  }
}

#tools {
  padding: 10px 5px;
  display: grid;
  // 3x4
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 10px;

  // LG
  @include media-screen-lg {
    padding: 0;
    margin-bottom: 5px;
    // 12x2
    // grid-template-columns: repeat(12, 1fr);
    grid-template-columns: none;
    grid-template-rows: none;
    gap: 0px;

    display: flex;
    :first-of-type {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    :last-of-type {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }

  .section {
    padding-top: 10px;
    cursor: pointer;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    // LG
    @include media-screen-lg {
      display: block;
      padding: 5px;
      background-color: rgb(126, 126, 126);
      color: white;

      &:hover {
        background-color: rgb(107, 106, 106);
      }

      .section__icon {
        margin: 0;
        padding: 0;
        font-size: 19px;
      }
      p {
        display: none;
      }
    }
  }
}

.option-active {
  background-color: $header_bg_color !important;
  color: $header_front_color;

  @include media-screen-lg {
    background-color: rgb(53, 53, 53) !important;
  }
}
</style>
