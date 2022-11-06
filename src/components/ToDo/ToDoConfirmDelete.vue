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
    a.text-primary.mr-2(@click='confirmationMode = !confirmationMode')
      | Cancelar
    //- Confirm
    a.text-danger.mr-2(@click='deleteToDoById(todo.id)')
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
      confirmationMode: false
    }
  },

  methods: {
    ...mapActions('todo', ['deleteToDoById'])
  }
}
</script>
