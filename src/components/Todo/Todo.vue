<template lang="pug">
  div(class="w-100 h-100 d-flex justify-content-between")
    .content(class="w-100 h-100 p-3")
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
      todo-detail(v-if="showTodoDetail" :todo="selectedTodo" @close="selectedTodo = null")

</template>

<script>
import TodoList from '@/components/Todo/TodoList'
import TodoCreate from '@/components/Todo/TodoCreate'
import TodoDetail from '@/components/Todo/TodoDetail'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TodoList,
    TodoCreate,
    TodoDetail
  },

  data: () => ({
    showCompletedTodos: true,

    selectedTodo: null
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
      return this.selectedTodo !== null
    }
  },

  //
  // NOTE: FIX WATCH PROPERTY
  watch: {
    todos (val) {
      // this.selectedTodo = val.filter(el => !el.done)[0]
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
      this.selectedTodo = todo
    }
  }
}
</script>

<style lang="scss" scoped>
.completed {
  opacity: 0.6;
  text-decoration: line-through;
  font-style: italic !important;
}
</style>
