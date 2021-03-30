<template lang="pug">
  transition(name="fade-up" mode="out-in")
    b-button(v-if="!confirmationMode"
            :key="1"
            @click="confirmationMode = true"
            variant="light"
            size="sm"
            class="mr-1"
            title="Eliminar tarea")
      b-icon(icon="trash" variant="danger")
    div(v-else class="row-v-center")
      //- Cancel
      a(class="text-primary" class="mr-2" @click="confirmationMode = !confirmationMode")
        | Cancelar
      //- Confirm
      a(class="text-danger" class="mr-2" @click="deleteToDoById(todo.id)")
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
