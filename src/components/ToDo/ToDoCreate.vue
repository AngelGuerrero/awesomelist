<template lang="pug">
  div
    b-input(placeholder="Nueva tarea" v-model="inputText" :disabled="isSaving" @change="createToDo")
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

export default {

  data: () => ({
    inputText: null,
    isSaving: false
  }),

  computed: {
    ...mapGetters('todo', [
      'getCurrentList'
    ]),

    ...mapState('user', [
      'currentUser'
    ])
  },

  methods: {
    ...mapActions('todo', [ 'saveToDo' ]),

    async createToDo () {
      const title = (this.inputText || '').trim()
      if (this.isSaving || !title || !this.currentUser) return

      const todo = {
        title,
        done: false,
        created: new Date(),
        lastUpdated: null,
        createdBy: this.currentUser.uid,
        collectionId: null
      }

      //
      // Add the filter for category of the current list
      if (this.getCurrentList.filter === 'collectionId') {
        todo.collectionId = this.getCurrentList.collectionId
      } else if (this.getCurrentList.name !== 'default') {
        const filter = this.getCurrentList.filter
        todo[filter] = true
      }

      this.isSaving = true
      try {
        const getval = await this.saveToDo(todo)
        if (getval.error) return

        this.clearInput()
        this.$emit('createdToDo', getval.data)
      } finally {
        this.isSaving = false
      }
    },

    clearInput () {
      this.inputText = null
    }
  }
}
</script>
