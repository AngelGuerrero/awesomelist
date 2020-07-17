<template lang="pug">
  div(class="w-100 h-100 d-flex")
    .menu
      to-do-menu
    .content(class="flex-grow-1 h-100 p-3")
      h1(class="h3" :style="getStyle") {{ getCurrentList.title }}
      to-do-create
      to-do-list(:todolist="getUncompletedToDos"
                @selectToDo="selectToDo"
                @checkToDo="completeToDo")

      b-button(v-if="thereAreCompletedToDos"
              variant="primary"
              size="sm"
              class="my-2"
              @click="showCompletedToDos = !showCompletedToDos") {{ getBtnText }}

      to-do-list(v-if="thereAreCompletedToDos"
                v-show="showCompletedToDos"
                :todolist="getCompletedToDos"
                @selectToDo="selectToDo"
                @checkToDo="uncompleteToDo"
                :class="{ 'completed': thereAreCompletedToDos }")

    .detail(class="ml-2")
      to-do-detail(v-if="showToDoDetail" :id="currentId" @close="currentId = null")

</template>

<script>
import ToDoMenu from '@/components/ToDo/ToDoMenu'
import ToDoList from '@/components/ToDo/ToDoList'
import ToDoCreate from '@/components/ToDo/ToDoCreate'
import ToDoDetail from '@/components/ToDo/ToDoDetail'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ToDoMenu,
    ToDoList,
    ToDoCreate,
    ToDoDetail
  },

  data: () => ({
    showMenu: false,

    showCompletedToDos: false,

    currentId: null
  }),

  computed: {
    ...mapState('todo', ['todos']),

    ...mapGetters('todo', [
      'getUncompletedToDos',
      'getCompletedToDos',
      'getCurrentList',
      'getCurrentListAccentColor'
    ]),

    thereAreCompletedToDos () {
      return this.getCompletedToDos.length > 0
    },

    getBtnText () {
      return this.showCompletedToDos ? 'Ocultar tareas completadas' : 'Mostrar tareas completadas'
    },

    showToDoDetail () {
      return this.currentId !== null
    },

    getStyle () {
      const style = {
        color: this.getCurrentList.accentColor
      }
      return style
    }
  },

  //
  // NOTE: FIX WATCH PROPERTY
  watch: {
    getUncompletedToDos: {
      deep: true,
      immediate: false,
      handler (todos) {
        // if (todos.length <= 0) return
        // const uncompleteToDo = todos[0]
        // this.currentId = uncompleteToDo.id
      }
    }
  },

  created () {
    this.getToDos()
  },

  methods: {
    ...mapActions('todo', ['getToDos', 'updateToDoById']),

    completeToDo (todo) {
      todo.done = true
      todo.lastUpdated = new Date()
      this.updateToDoById(todo)
    },

    uncompleteToDo (todo) {
      todo.done = false
      todo.lastUpdated = new Date()
      this.updateToDoById(todo)
    },

    selectToDo (todo) {
      this.currentId = todo.id
    }
  }
}
</script>

<style lang="scss" scoped>
.toDo__title {
  color: rgb(207, 23, 23);
}

.content {
  overflow: auto;
  margin-left: 40px;

  @media screen and (min-width: 650px) {
    margin-left: 0;
  }
}

.completed {
  opacity: 0.6;
  text-decoration: line-through;
  font-style: italic !important;
}
</style>
