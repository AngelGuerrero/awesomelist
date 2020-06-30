<template lang="pug">
  div
    div(v-if="todolist.length <= 0")
      p No data to show
    b-list-group(v-else class="my-3")
      b-list-group-item(v-for="todo in todolist" :key="todo.id"
                        button
                        @click="emitSelect(todo)"
                        class="border rounded d-flex align-items-center my-1")
        vs-checkbox(v-model="todo.done" @change="emitCheck(todo)" class="m-0 p-0")
        span(class="ml-4") {{ todo.title }}
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
