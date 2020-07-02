<template lang="pug">
  div(class="w-100 h-100 d-flex")
    .menu
      todo-menu
    .content(class="flex-grow-1 h-100 p-3")
      h1(class="h3") Tareas
      todo-create
      todo-list(:todolist="getUncompletedTodos"
                @selectTodo="selectTodo"
                @checkTodo="completeTodo")

      b-button(v-if="thereAreCompletedTodos"
              variant="primary"
              size="sm"
              class="my-2"
              @click="showCompletedTodos = !showCompletedTodos") {{ getBtnText }}

      todo-list(v-if="thereAreCompletedTodos"
                v-show="showCompletedTodos"
                :todolist="getCompletedTodos"
                @selectTodo="selectTodo"
                @checkTodo="uncompleteTodo"
                :class="{ 'completed': thereAreCompletedTodos }")

    .detail(class="ml-2")
      todo-detail(v-if="showTodoDetail" :id="currentId" @close="currentId = null")

</template>

<script>
import TodoMenu from '@/components/Todo/TodoMenu'
import TodoList from '@/components/Todo/TodoList'
import TodoCreate from '@/components/Todo/TodoCreate'
import TodoDetail from '@/components/Todo/TodoDetail'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TodoMenu,
    TodoList,
    TodoCreate,
    TodoDetail
  },

  data: () => ({
    showMenu: false,

    showCompletedTodos: true,

    currentId: null
  }),

  computed: {
    ...mapState('todo', ['todos']),

    ...mapGetters('todo', ['getUncompletedTodos', 'getCompletedTodos']),

    thereAreCompletedTodos () {
      return this.getCompletedTodos.length > 0
    },

    getBtnText () {
      return this.showCompletedTodos ? 'Ocultar tareas completadas' : 'Mostrar tareas completadas'
    },

    showTodoDetail () {
      return this.currentId !== null
    }
  },

  //
  // NOTE: FIX WATCH PROPERTY
  watch: {
    getUncompletedTodos: {
      deep: true,
      immediate: false,
      handler (todos) {
        // if (todos.length <= 0) return
        // const uncompleteTodo = todos[0]
        // this.currentId = uncompleteTodo.id
      }
    }
  },

  created () {
    this.getTodos()
  },

  methods: {
    ...mapActions('todo', ['getTodos', 'updateTodoById']),

    completeTodo (todo) {
      todo.done = true
      todo.lastUpdated = new Date()
      this.updateTodoById(todo)
    },

    uncompleteTodo (todo) {
      todo.done = false
      todo.lastUpdated = new Date()
      this.updateTodoById(todo)
    },

    selectTodo (todo) {
      this.currentId = todo.id
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  overflow: auto;
  @media screen and (max-width: 648px) {
    margin-left: 40px;
  }
}

.completed {
  opacity: 0.6;
  text-decoration: line-through;
  font-style: italic !important;
}
</style>
