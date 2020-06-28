<template lang="pug">
  div
    el-input(placeholder="Nueva tarea" v-model="todo" @change="createTodo")
</template>

<script>
import { mapActions } from 'vuex'

export default {

  data: () => ({
    todo: null
  }),

  methods: {
    ...mapActions('todo', [ 'saveTodo' ]),

    createTodo () {
      this.saveTodo({
        title: this.todo,
        done: false,
        created: new Date(),
        lastUpdated: null,
        createdBy: 'User test'
      })

      this.clearInput()
    },

    clearInput () {
      this.todo = null
    }
  }
}
</script>
