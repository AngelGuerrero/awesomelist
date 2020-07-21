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

    async createToDo () {
      const todo = {
        title: this.inputText,
        done: false,
        created: new Date(),
        lastUpdated: null,
        // TODO: change to real firebase user
        createdBy: 'User test'
      }

      //
      // Add the filter for category of the current list
      if (this.getCurrentList.name !== 'default') {
        const filter = this.getCurrentList.filter
        todo[filter] = true
      }

      const getval = await this.saveToDo(todo)
      if (getval.error) return

      this.clearInput()
      this.$emit('createdToDo', getval.data)
    },

    clearInput () {
      this.inputText = null
    }
  }
}
</script>
