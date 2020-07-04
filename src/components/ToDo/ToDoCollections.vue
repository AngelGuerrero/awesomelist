<template lang="pug">
  div.h-100.dev
    .no_collections(v-if="collections.length <= 0")
      b-spinner(label="Cargando..." small class="mr-2")
      | Cargando...

    .collections(v-else)
      .collections__header
        p Colecciones

      .items__wrapper(v-for="(collection, index) in collections" :key="collection.id")
        .item(v-b-toggle="'collapse-' + index" @click="downloadListsFromCollection(collection)")
          b-icon(icon="files" class="icon--left")
          .item__text {{ collection.name }}
          b-icon(icon="arrow-right-short" class="icon--right")

        //- If have lists
        b-collapse(:id="`collapse-${index}`")
          .no_lists(v-if="!collection.lists")
            b-spinner(label="Cargando listas..." small class="mr-2")
            span Cargando...
          div(v-else)
            .no_lists(v-if="collection.lists.length <= 0")
              span No hay listas actualmente
            .list__item(v-else v-for="list in collection.lists" :key="list.id")
              b-icon.icon--left(icon="list")
              .item__text.w-75 {{ list.name }}
</template>

<script>
import {
  mapState,
  mapActions
} from 'vuex'

export default {
  data () {
    return {
      selectedCollectionId: null
    }
  },

  computed: {
    ...mapState('todo', ['collections', 'lists'])

    // ...mapGetters('todo', [
    //   'thereAreLists'
    // ])
  },

  created () {
    this.getCollections()
  },

  methods: {
    ...mapActions('todo', ['getCollections', 'getListsFromCollection']),

    async downloadListsFromCollection (collection) {
      const getval = await this.getListsFromCollection(collection.id)
      console.log(`Message: ${getval.message}`)
    },

    noPropertyOrEmptyLists (collection) {
      const retval = {
        error: false,
        warning: false,
        message: 'ok'
      }

      if (!collection.lists) {
        retval.error = true
        retval.message = 'No existe la propiedad'
        return retval
      }

      if (collection.lists.length <= 0) {
        retval.error = false
        retval.warning = true
        retval.message = 'No hay listas aún'
        return retval
      }

      return retval
    }
  }
}
</script>

<style lang="scss" scoped>
//
// Variables
@import "@/assets/scss/partials/variables.scss";

.no_collections {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.collections {
  overflow: auto;
}

.collections__header {
  width: $toDoMenu_max_width;
  overflow: hidden;
  padding: 5px;
  background-color: $sidebar_contrast_dark;
  p {
    margin: 0;
    text-transform: uppercase;
    font-size: 0.8rem;
    text-align: center;
    color: $header_bg_color;
    font-weight: 600;
  }
}

.items__wrapper {
  width: $toDoMenu_max_width;
  background-color: $sidebar_contrast_light;
}

.no_lists {
  width: 100%;
  height: 100%;
  padding: 10px;
  text-align: center;
}

.item {
  width: 100%;
  padding: 5px 0;
  display: flex;
  align-items: center;
  background-color: $sidebar_bg_light;
  &:hover {
    background-color: $header_bg_light;
    cursor: pointer;
  }

  &__text {
    width: 50%;
  }
}

.list__item {
  @extend .item;
  padding-left: 0.6rem;
  background-color: white;
  &:hover {
    background-color: white;
    text-decoration: underline;
    color: $header_bg_color;
  }
}

.icon {
  font-size: 1.1rem;
  width: 20%;
  padding: 0;
  display: flex !important;
}

.icon--left {
  @extend .icon;
  margin-right: 0.5rem;
}

.icon--right {
  @extend .icon;
}
</style>
