<template lang="pug">
  div(class="w-100 h-100 d-flex justify-content-between")
    .content(class="w-100 h-100 p-3")
      todo-create

      todo-list(:todolist="getUncompletedTodos"
                @selectTodo="selectTodo"
                @checkTodo="completeTodo")

      el-button(type="primary"
                size="small"
                class="my-2"
                @click="showCompletedTodos = !showCompletedTodos") {{ getBtnText }}

      todo-list(v-show="showCompletedTodos"
                :todolist="getCompletedTodos"
                @checkTodo="uncompleteTodo"
                class="completed")

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

    getBtnText () {
      return this.showCompletedTodos ? 'Ocultar tareas completadas' : 'Mostrar tareas completadas'
    },

    showTodoDetail () {
      return this.selectedTodo !== null
    }
  },

  //
  // NOTE: DELETE WATCH PROPERTY
  watch: {
    todos (val) {
      this.selectedTodo = val[0]
    }
  },

  created () {
    this.getTodos()
  },

  methods: {
    ...mapActions('todo', ['getTodos', 'updateTodoToDone']),

    completeTodo (todo) {
      this.updateTodoToDone({ id: todo.id, done: true })
    },

    uncompleteTodo (todo) {
      this.updateTodoToDone({ id: todo.id, done: false })
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
