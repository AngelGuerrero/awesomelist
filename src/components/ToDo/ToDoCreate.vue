<template lang="pug">
  div
    b-input(placeholder="Nueva tarea" v-model="inputText" @change="createToDo")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {

  data: () => ({
    inputText: null
  }),

  computed: mapGetters('todo', ['getCurrentList']),

  methods: {
    ...mapActions('todo', [ 'saveToDo' ]),

    createToDo () {
      const todo = {
        title: this.inputText,
        done: false,
        created: new Date(),
        lastUpdated: null,
        createdBy: 'User test'
      }

      //
      // Add the filter for category of the current list
      if (this.getCurrentList.name !== 'default') {
        const filter = this.getCurrentList.filter
        todo[filter] = true
      }

      this.saveToDo(todo)
      this.clearInput()
    },

    clearInput () {
      this.inputText = null
    }
  }
}
</script>
