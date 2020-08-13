<template lang="pug">
  #toDoToolsWrapper(class="box-shadow")
    #tools
      //- Select items
      .section.selection-active
        b-icon(icon="card-checklist" class="h3")
        p Modo seleccionar

      //- Filter
      .section.selection-active
        b-icon(icon="filter" class="h3")
        p Filtrar

      //- Search
      .section
        b-icon(icon="search" class="h3")
        p Buscar
</template>

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
    box-shadow: 3px 3px 3px 3px rgba(241, 241, 241, 0.753);
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
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: none;
    gap: 0px;
  }

  .section {
    padding-top: 10px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    // LG
    @include media-screen-lg {
      margin: 3px;
      &:nth-child(n) {
        border-radius: 10px;
      }
      p {
        display: none;
      }
    }
  }
}

.selection-active {
  background-color: $header_bg_color;
  color: $header_front_color;
}
</style>
