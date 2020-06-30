<template lang="pug">
  div
<<<<<<< HEAD
    div(v-if="todolist.length <= 0")
      p No data to show
    b-list-group(v-else class="my-3")
      b-list-group-item(v-for="todo in todolist" :key="todo.id"
                        button
                        @click="emitSelect(todo)"
                        class="border rounded d-flex align-items-center my-1")
        vs-checkbox(v-model="todo.done" @change="emitCheck(todo)" class="m-0 p-0")
        span(class="ml-4") {{ todo.title }}
=======
    .column
      b-list-group
        b-list-group-item(v-for="todo in getUncompletedTodos" :key="todo.id" class="my-1 border radius" button)
          el-checkbox(size="medium" :label="todo.title" v-model="todo.done" @change="completeTodo(todo)")

    .div
      el-button(type="primary" size="small" @click="toggleTodoList") {{ getBtnText }}

    .column(v-show="showCompletedTodos")
      b-list-group
        b-list-group-item(v-for="todo in getCompletedTodos" :key="todo.id" class="my-1 border radius" button)
          el-checkbox(v-model="todo.done" :label="todo.title" @change="uncompleteTodo(todo)")
            span(class="completed") {{ todo.title }}

>>>>>>> 40470bb4c92e89c0d3ede2942b47bf161c88546d
</template>

<script>
export default {
<<<<<<< HEAD
  props: {
    todolist: {
      type: Array,
      required: false,
      default: () => ([])
    }
=======
  name: 'TodoList',

  data: () => ({
    showCompletedTodos: true,

    btnText: 'Mostrar tareas completadas'
  }),

  computed: {
    ...mapState('todo', ['todos']),

    ...mapGetters('todo', ['getUncompletedTodos', 'getCompletedTodos']),

    getBtnText: function () {
      return this.showCompletedTodos ? 'Ocultar tareas completadas' : 'Mostrar tareas completadas'
    }
  },

  created () {
    this.getTodos()
>>>>>>> 40470bb4c92e89c0d3ede2942b47bf161c88546d
  },

  methods: {
    emitSelect (todo) {
      this.$emit('selectTodo', todo)
    },

<<<<<<< HEAD
    emitCheck (todo) {
      this.$emit('checkTodo', todo)
=======
    uncompleteTodo (todo) {
      this.updateTodoToDone({ id: todo.id, done: false })
    },

    toggleTodoList () {
      this.showCompletedTodos = !this.showCompletedTodos
>>>>>>> 40470bb4c92e89c0d3ede2942b47bf161c88546d
    }
  }
}
</script>
