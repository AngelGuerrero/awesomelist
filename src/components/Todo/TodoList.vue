<template lang="pug">
  div
    div(v-if="todolist.length <= 0" class="p-5 column-v-center column-h-center")
      b-icon(icon="archive" class="h1")
      h5 No hay tareas para mostrar

    b-list-group(v-else class="my-3")
      b-list-group-item(v-for="todo in todolist" :key="todo.id"
                        button
                        class="border rounded d-flex align-items-center my-1 p-0")
        vs-checkbox(v-model="todo.done" @change="emitCheck(todo)" class="ml-1 mr-2 p-2")
        div(class="w-100 p-2" @click="emitSelect(todo)")
          span {{ todo.title }}
</template>

<script>
export default {
  props: {
    todolist: {
      type: Array,
      required: false,
      default: () => ([])
    }
  },

  methods: {
    emitSelect (todo) {
      this.$emit('selectTodo', todo)
    },

    emitCheck (todo) {
      this.$emit('checkTodo', todo)
    }
  }
}
</script>
