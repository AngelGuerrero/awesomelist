<template lang="pug">
  div
    .column
      .todo__box(v-for="todo in getUncompletedTodos")
        el-checkbox(:label="todo.title"
                    v-model="todo.done"
                    @change="completeTodo(todo)")

    .div
      el-button(type="primary" size="small" @click="showCompletedTodos = !showCompletedTodos") Mostrar tareas completadas

    .column(v-show="showCompletedTodos")
      .todo__box(class="completed" v-for="todo in getCompletedTodos" :key="todo.id")
        el-checkbox(v-model="todo.done" @change="uncompleteTodo(todo)")
          span(class="completed") {{ todo.title }}

</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'TodoList',

  data: () => ({
    showCompletedTodos: true
  }),

  computed: {
    ...mapState('todo', ['todos']),
    ...mapGetters('todo', ['getUncompletedTodos', 'getCompletedTodos'])
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
