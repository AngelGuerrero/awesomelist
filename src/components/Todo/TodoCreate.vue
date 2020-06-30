<template lang="pug">
  div
<<<<<<< HEAD
    b-input(placeholder="Nueva tarea" v-model="todo" @change="createTodo")
=======
    el-input(placeholder="Nueva tarea"
             size="large"
             v-model="todo"
             @change="createTodo")
>>>>>>> 40470bb4c92e89c0d3ede2942b47bf161c88546d
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
