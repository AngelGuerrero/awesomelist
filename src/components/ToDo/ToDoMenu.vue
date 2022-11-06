<template lang="pug">
.wrapper.border.shadow(:class='{ "wrapper--fixed": toDoMenu.isFixed }')
  //- Toggle button set aside
  .item_button__container
    b-button.rounded-0(
      variant='light',
      @click='toggleToDoMenuFixed(!toDoMenu.isFixed)')
      b-icon(v-if='toDoMenu.isFixed', icon='toggle-on', variant='primary')
      b-icon.text-muted(v-else, icon='toggle-off')
  .menu__header.h-25
    //- Header: Mi día
    .item_button__container
      b-button.d-flex.row-v-center.rounded-0(
        block,
        variant='light',
        @click='showMyDayList')
        b-icon.h5.mb-0.mr-3.p-0(icon='brightness-high', variant='danger')
        .w-100.text-left
          span.text-small Mi día
    //- Header: Importante
    .item_button__container
      b-button.d-flex.row-v-center.rounded-0(
        block,
        variant='light',
        @click='showImportantList')
        b-icon.h5.mb-0.mr-3.p-0(icon='star', variant='warning')
        .w-100.text-left
          span.text-small Importante
    //- Header: Tareas
    .item_button__container
      b-button.d-flex.row-v-center.rounded-0(
        block,
        variant='light',
        @click='showDefaultList')
        b-icon.h5.mb-0.mr-3.p-0(icon='list-task', variant='primary')
        .w-100.text-left
          span.text-small Tareas

  //- Content: Collections
  .menu__content.h-75
    to-do-collections

  //- Footer
  .menu__footer
    //- Collection: Form
    .item_button__container.d-flex.row-v-center.bg-white(
      v-if='collection.visible')
      b-icon.h2.mb-0.ml-2.mr-1.pl-1(icon='box', variant='dark')
      b-input.bg-white.rounded-0.border-0(
        ref='collection__name',
        type='text',
        v-model='collection.name',
        @keyup.enter='saveToDoCollection',
        @keyup.esc='clearToDoCollectionInput',
        @blur='clearToDoCollectionInput',
        placeholder='Colección')
      b-button.rounded-0.bg-white(variant='light', size='sm')
        b-icon(icon='file-plus', variant='primary')
    //- Collection: Active button
    .item_button__container
      b-button.d-flex.row-v-center.rounded-0(
        block,
        variant='light',
        @click='toggleCollectionForm')
        b-icon.h5.mb-0.mr-3.p-0(icon='plus', variant='primary')
        .w-100.text-left
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
    ...mapState('ui', ['toDoMenu']),
    ...mapState('user', ['currentUser'])
  },

  watch: {
    'collection.visible' (visible) {
      if (visible) {
        setTimeout(_ => this.$refs.collection__name.focus(), 200)
      }
    }
  },

  methods: {
    ...mapMutations('todo', ['setCurrentList']),
    ...mapActions('todo', ['createNewToDoCollection']),

    ...mapMutations('ui', ['toggleToDoMenuFixed']),

    saveToDoCollection () {
      this.createNewToDoCollection({
        name: this.collection.name,
        userId: this.currentUser.uid
      })
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
  border-radius: 5px;

  &:hover {
    width: $toDoMenu_max_width;
  }

  @media screen and (max-width: 648px) {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 8;
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
  input[type='text'] {
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
