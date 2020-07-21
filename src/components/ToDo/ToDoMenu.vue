<template lang="pug">
  .wrapper(class="border shadow" :class="{ 'wrapper--fixed': toDoMenu.isFixed }")
    //- Toggle button set aside
    .item_button__container
      b-button(variant="light"
              class="rounded-0"
              @click="toggleToDoMenuFixed(!toDoMenu.isFixed)")
        b-icon(v-if="toDoMenu.isFixed" icon="toggle-on" variant="primary")
        b-icon(v-else icon="toggle-off" class="text-muted")
    .menu__header.h-25
      //- Header: Mi día
      .item_button__container
        b-button(block
                variant="light"
                @click="showMyDayList"
                class="d-flex row-v-center rounded-0")
          b-icon(icon="brightness-high" variant="danger" class="h5 mb-0 mr-3 p-0")
          div(class="w-100 text-left")
            span.text-small Mi día
      //- Header: Importante
      .item_button__container
        b-button(block
                variant="light"
                @click="showImportantList"
                class="d-flex row-v-center rounded-0")
          b-icon(icon="star" variant="warning" class="h5 mb-0 mr-3 p-0")
          div(class="w-100 text-left")
            span.text-small Importante
      //- Header: Tareas
      .item_button__container
        b-button(block
                variant="light"
                @click="showDefaultList"
                class="d-flex row-v-center rounded-0")
          b-icon(icon="list-task" variant="primary" class="h5 mb-0 mr-3 p-0")
          div(class="w-100 text-left")
            span.text-small Tareas

    //- Content: Collections
    .menu__content.h-75
      to-do-collections

    //- Footer
    .menu__footer
      //- Collection: Form
      .item_button__container(v-if="collection.visible" class="d-flex row-v-center bg-white")
        b-icon(icon="box" variant="dark" class="h2 mb-0 ml-2 mr-1 pl-1")
        b-input(ref="collection__name"
                type="text"
                v-model="collection.name"
                @keyup.enter="saveToDoCollection"
                @keyup.esc="clearToDoCollectionInput"
                @blur="clearToDoCollectionInput"
                placeholder="Colección"
                class="bg-white rounded-0 border-0")
        b-button(variant="light"
                size="sm"
                class="rounded-0 bg-white")
          b-icon(icon="file-plus" variant="primary")
      //- Collection: Active button
      .item_button__container
        b-button(block variant="light"
                @click="toggleCollectionForm"
                class="d-flex row-v-center rounded-0")
          b-icon(icon="plus" variant="primary" class="h5 mb-0 mr-3 p-0")
          div(class="w-100 text-left")
            span.text-small Nueva colección
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import ToDoCollections from '@/components/ToDo/ToDoCollections'

export default {
  components: {
    ToDoCollections
  },

  data: () => ({
    //
    // Data for the new collection
    collection: {
      visible: false,
      name: ''
    }
  }),

  computed: {
    ...mapState('ui', ['toDoMenu'])
  },

  watch: {
    'collection.visible' (visible) {
      if (visible) { setTimeout(_ => this.$refs.collection__name.focus(), 200) }
    }
  },

  methods: {
    ...mapMutations('todo', ['setCurrentList']),
    ...mapActions('todo', ['createNewToDoCollection']),

    ...mapMutations('ui', ['toggleToDoMenuFixed']),

    saveToDoCollection () {
      this.createNewToDoCollection({ name: this.collection.name, userId: 'testuser' })
      this.clearToDoCollectionInput()
    },

    clearToDoCollectionInput () {
      this.collection.name = ''
      this.collection.visible = false
    },

    toggleCollectionForm () {
      this.collection.visible = !this.collection.visible
    },

    showMyDayList () {
      this.setCurrentList(this.$store.state.todo.categories.MYDAY)
    },

    showImportantList () {
      this.setCurrentList(this.$store.state.todo.categories.IMPORTANT)
    },

    showDefaultList () {
      this.setCurrentList(this.$store.state.todo.categories.DEFAULT)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  min-width: $toDoMenu_min_width;
  max-width: $toDoMenu_max_width;
  width: $toDoMenu_min_width;

  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;

  transition: all 0.5s;
  background-color: $sidebar_bg_light;

  &:hover {
    width: $toDoMenu_max_width;
  }

  @media screen and (max-width: 648px) {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }
}

.wrapper--fixed {
  width: $toDoMenu_max_width;
}

.menu__header {
  overflow: hidden;
  &:hover {
    overflow-x: hidden;
    overflow-y: auto;
  }
}

.menu__content {
  overflow: hidden;
}

.item_button__container {
  overflow: hidden;
  width: $toDoMenu_max_width;
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
</style>
