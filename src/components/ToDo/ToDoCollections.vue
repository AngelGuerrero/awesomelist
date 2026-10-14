<template lang="pug">
.collections__wrapper
  .no_collections(v-if='collectionsLoading')
    b-spinner.mr-2(small label='Cargando colecciones')
    | Cargando...
  .no_collections.flex-column(v-else-if='collectionsError')
    span.text-danger No se pudieron cargar las colecciones.
    b-button.mt-2(variant='light' size='sm' @click='retry') Reintentar
  .no_collections(v-else-if='collections.length <= 0') No hay colecciones.
  .collections(v-else)
    .collections__header
      .header__title Colecciones
      .header__options.d-flex
        b-button.icon__button.border-0.p-0.mr-2(variant='light' size='sm' title='Contraer todas las colecciones' aria-label='Contraer todas las colecciones' @click='collapseAll')
          b-icon.icon(icon='arrows-collapse')
        b-button.icon__button.border-0.p-0(variant='light' size='sm' title='Expandir todas las colecciones' aria-label='Expandir todas las colecciones' @click='expandAll')
          b-icon.icon(icon='arrows-expand')
    .collections__content
      .collection__wrapper.border-bottom(v-for='collection in collections' :key='collection.id')
        b-button.collection__item.w-100.rounded-0.border-0.d-flex.align-items-center.text-left(
          variant='light',
          :class='{ "text-primary": isSelected(collection) }',
          :pressed='isSelected(collection)',
          :aria-expanded='isExpanded(collection) ? "true" : "false"',
          :aria-controls='collapseId(collection)',
          @click='toggleCollection(collection)')
          b-icon.icon--left(icon='files')
          .item__text.flex-grow-1 {{ collection.name }}
          span.text-muted.mr-2(:title='taskCount(collection) + " tareas"') {{ taskCount(collection) }}
          b-icon.icon--right(:icon='isExpanded(collection) ? "arrow-down-short" : "arrow-right-short"')
        b-collapse(:id='collapseId(collection)' :visible='isExpanded(collection)')
          .collection__tasks
            .no_lists(v-if='taskCount(collection) === 0') Colección vacía
            b-button.list__item.w-100.rounded-0.border-0.d-flex.align-items-center.text-left(
              v-for='todo in collectionTasks(collection)',
              :key='todo.id',
              variant='light',
              @click='showTask(collection, todo)')
              b-icon.icon--left(:icon='todo.done ? "check-circle" : "list-task"')
              span.item__text.flex-grow-1.text-truncate(:class='{ "task--completed": todo.done }' :title='todo.title') {{ todo.title }}
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  data () {
    return { expandedCollections: [] }
  },

  computed: {
    ...mapState('todo', ['collections', 'todos', 'currentList', 'collectionsLoading', 'collectionsError']),
    ...mapState('user', ['currentUser'])
  },

  watch: {
    currentUser: {
      immediate: true,
      handler (user) {
        this.expandedCollections = []
        this.getCollections(user ? user.uid : null)
      }
    }
  },

  methods: {
    ...mapActions('todo', ['getCollections']),
    ...mapMutations('todo', ['selectCollection']),
    ...mapMutations('ui', ['setSelectedComponent']),

    collectionTasks (collection) {
      return this.todos.filter(todo => todo.collectionId === collection.id)
    },

    taskCount (collection) {
      return this.collectionTasks(collection).length
    },

    collapseId (collection) {
      return 'collection-tasks-' + collection.id
    },

    isExpanded (collection) {
      return this.expandedCollections.includes(collection.id)
    },

    toggleCollection (collection) {
      this.selectCollection(collection)
      this.expandedCollections = this.isExpanded(collection)
        ? this.expandedCollections.filter(id => id !== collection.id)
        : this.expandedCollections.concat(collection.id)
    },

    collapseAll () {
      this.expandedCollections = []
    },

    expandAll () {
      this.expandedCollections = this.collections.map(collection => collection.id)
    },

    showTask (collection, todo) {
      this.selectCollection(collection)
      this.setSelectedComponent({ name: 'ToDoDetail', props: { id: todo.id } })
    },

    isSelected (collection) {
      return this.currentList && this.currentList.filter === 'collectionId' && this.currentList.collectionId === collection.id
    },

    retry () {
      this.getCollections(this.currentUser ? this.currentUser.uid : null)
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
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: $sidebar_contrast_light;
}

.header__options .icon__button {
  background: transparent;
  line-height: 1;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collection__tasks {
  height: 180px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: white;
}

.item__text {
  min-width: 0;
}

.task--completed {
  text-decoration: line-through;
  opacity: 0.6;
}

.no_lists {
  width: 100%;
  height: 100%;
  padding: 10px;
  text-align: center;
}

.collection__item {
  font-size: 13px;
  line-height: 1.5;
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
  width: $toDoMenu_icon_size;
  height: $toDoMenu_icon_size;
  font-size: $toDoMenu_icon_size;
  flex-shrink: 0;
  padding: 0;
}

.icon__button {
  cursor: pointer;
}

.icon--left {
  @extend .icon;
  margin-left: 12px;
  margin-right: 20px;
}

.icon--right {
  @extend .icon;
  margin-right: 12px;
}
</style>
