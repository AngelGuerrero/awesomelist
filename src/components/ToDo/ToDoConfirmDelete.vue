<template lang="pug">
transition(name='fade-up', mode='out-in')
  b-button.mr-1(
    v-if='!confirmationMode',
    :key='1',
    @click='confirmationMode = true',
    variant='light',
    size='sm',
    title='Eliminar tarea')
    b-icon(icon='trash', variant='danger')
  .row-v-center(v-else)
    //- Cancel
    a.text-primary.mr-2(@click='cancelDelete')
      | Cancelar
    //- Confirm
    a.text-danger.mr-2(@click='confirmDelete' :aria-disabled='isDeleting')
      | Confirmar
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ToDoConfirmDelete',

  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      confirmationMode: false,
      isDeleting: false
    }
  },

  methods: {
    ...mapActions('todo', ['deleteToDoById']),

    cancelDelete () {
      if (!this.isDeleting) this.confirmationMode = false
    },

    async confirmDelete () {
      if (this.isDeleting) return

      this.isDeleting = true
      try {
        const response = await this.deleteToDoById(this.todo.id)
        if (!response.error) this.confirmationMode = false
      } finally {
        this.isDeleting = false
      }
    }
  }
}
</script>
