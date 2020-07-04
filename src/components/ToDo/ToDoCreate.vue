<template lang="pug">
  div
    b-input(placeholder="Nueva tarea" v-model="todo" @change="createToDo")
</template>

<script>
import { mapActions } from 'vuex'

export default {

  data: () => ({
    todo: null
  }),

  methods: {
    ...mapActions('todo', [ 'saveToDo' ]),

    createToDo () {
      this.saveToDo({
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
