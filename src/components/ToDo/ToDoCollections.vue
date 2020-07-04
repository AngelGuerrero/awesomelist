<template lang="pug">
  .collections__wrapper
    //- pre.pre-dev {{ $data }}
    .no_collections(v-if="collections.length <= 0")
      b-spinner(label="Cargando..." small class="mr-2")
      | Cargando...

    .collections(v-else)
      .collections__header
        .header__title Colecciones
        .header__options
          b-icon.icon__button(icon="arrows-collapse" @click="collapseAllRegisterItems")
          b-icon.icon__button(icon="arrows-expand" @click="expandAll")

      .collections__content
        .collection__wrapper.border-bottom(v-for="(collection, index) in collections" :key="collection.id")
          .collection__item(v-b-toggle="'collapse-' + index" @click="downloadListsFromCollection(collection); registerCollapsedItems('collapse-', index);")
            b-icon.icon--left(icon="files")
            .item__text.flex-grow-1 {{ collection.name }}
            b-icon.icon--right(icon="arrow-right-short")

          //- Lists from current collection
          b-collapse(:id="`collapse-${index}`")
            .no_lists(v-if="!collection.lists")
              b-spinner(label="Cargando listas..." small class="mr-2")
              span Cargando...
            div(v-else)
              .no_lists(v-if="collection.lists.length <= 0")
                span Colección vacía
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
      collapsedCollections: []
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

    downloadListsFromCollection (collection) {
      this.getListsFromCollection(collection.id)
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
    },

    registerCollapsedItems (attr, id) {
      const composedId = attr + id

      const addItem = (param) => this.collapsedCollections.push(param)

      try {
        const found = this.collapsedCollections.find(element => element === composedId)
        if (found) return setTimeout(_ => this.removeFromItemsCollapsed(composedId))

        setTimeout(_ => addItem(attr + id))
      } catch (error) {
        console.log('error :>> ', error.message)
      }
    },

    removeFromItemsCollapsed (identifier) {
      this.collapsedCollections = this.collapsedCollections.filter(element => element !== identifier)
    },

    collapseAllRegisterItems () {
      const removeAll = () => { this.collapsedCollections = [] }

      const collapseAll = () =>
        this.collapsedCollections
          .map(element => this.$root.$emit('bv::toggle::collapse', element))

      setTimeout(_ => {
        collapseAll()
        removeAll()
      })
    },

    toggleCollapseAll () {
      this.collections.forEach(element => this.$root.$emit('bv::toggle::collapse', element))
    },

    expandAll () {
      const collectionsToExpand = this.collections.reduce((acc, curr, index, arr) => {
        const composedId = 'collapse-' + index

        const found = this.collapsedCollections.find(element => element === composedId)

        if (!found) acc.push({ composedId, data: curr, index })

        return acc
      }, [])

      //
      // NOTE: Fix, improve this feature
      // I'm doing raw code, and i don't like it...
      //
      const expandItems = () =>
        collectionsToExpand.forEach(el => {
          this.$root.$emit('bv::toggle::collapse', el.composedId)
          this.downloadListsFromCollection(el.data)
        })

      setTimeout(_ => expandItems())
      collectionsToExpand.forEach(el => this.registerCollapsedItems('collapse-', el.index))
    }
  }
}
</script>

<style lang="scss" scoped>
.no_collections {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.collections__wrapper {
  width: $toDoMenu_max_width;
  height: 100%;
  overflow: hidden;
}

.collections {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.collections__header {
  padding: 5px;
  background-color: $sidebar_contrast_dark;
  display: flex;
  justify-content: space-between;
  .header__title {
    margin: 0;
    text-transform: uppercase;
    font-size: 0.8rem;
    text-align: center;
    color: $header_bg_color;
    font-weight: 600;
  }
}

.collections__content {
  flex-grow: 1;
  overflow: auto;
  background-color: $sidebar_contrast_light;
}

.no_lists {
  width: 100%;
  height: 100%;
  padding: 10px;
  text-align: center;
}

.collection__item {
  width: 100%;
  padding: 5px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  @extend .collection__item;
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
  min-width: 20%;
  padding: 0;
}

.icon__button {
  @extend .icon;
  cursor: pointer;
}

.icon--left {
  @extend .icon;
  margin-right: 0.5rem;
}

.icon--right {
  @extend .icon;
}
</style>
