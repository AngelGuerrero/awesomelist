<template lang="pug">
  div
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

</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
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
  },

  methods: {
    ...mapActions('todo', ['getTodos', 'updateTodoToDone']),

    completeTodo (todo) {
      this.updateTodoToDone({ id: todo.id, done: true })
    },

    uncompleteTodo (todo) {
      this.updateTodoToDone({ id: todo.id, done: false })
    },

    toggleTodoList () {
      this.showCompletedTodos = !this.showCompletedTodos
    }
  }
}
</script>

<style lang="scss" scoped>
.column {
  padding-top: 15px;
  padding-bottom: 15px;
}

.todo__box {
  background-color: white;
  border: 1px solid #dadada;
  border-radius: 5px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-checkbox {
    flex-grow: 1;
    margin: 5px 0px;
    padding: 7px;
    overflow: hidden;
  }
}

.completed {
  opacity: 0.6;
  text-decoration: line-through;
  font-style: italic;
}

.more__icon {
  transform: rotate(90deg);
  padding: 8px 5px;
  &:hover {
   cursor: pointer;
   color: red;
  }
}
</style>
