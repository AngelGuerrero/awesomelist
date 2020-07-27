<template lang="pug">
  .todolist__component
    div(v-if="todolist.length <= 0" class="p-5 column-v-center column-h-center")
      b-icon(icon="archive" class="h1")
      h5 No hay tareas para mostrar
    //- Wrapper of all To Do's
    b-list-group(v-else class="my-3 animate__fadeInUp")
      //- To Do Item
      b-list-group-item(v-for="todo in todolist" :key="todo.id" button class="bg-light border rounded d-flex flex-column my-1 p-0")
        div(class="w-100 d-flex align-items-center")
          //- Checkbox
          vs-checkbox(v-model="todo.done" @change="emitCheck(todo)" class="ml-1 mr-2 p-2")
          //- Content
          div(class="item__text flex-grow-1 p-2" @click="emitSelect(todo)")
            span {{ todo.title }}
          //- Item options
          div(class="d-flex")
            //- Mark as important buttons
            transition(name="fade-up" mode="out-in")
              b-button(v-if="todo.isImportant"
                      :key="1"
                      @click="onToggleMarkAsImportant({ todo, value: false })"
                      variant="light"
                      size="sm"
                      class="mr-1"
                      title="Desmarcar tarea")
                b-icon(icon="star-fill" variant="warning")

              b-button(v-else
                      :key="2"
                      @click="onToggleMarkAsImportant({ todo, value: true })"
                      variant="light"
                      size="sm"
                      class="mr-1"
                      title="Marcar tarea como imporante")
                b-icon(icon="star" variant="warning")
            //- Add to my day button
            transition(name="fade-up" mode="out-in")
              b-button(v-if="todo.isOnMyDay"
                      :key="1"
                      @click="onToggleAddToMyDay({ todo, value: false })"
                      variant="light"
                      size="sm"
                      class="mr-1"
                      title="Quitar de mi día")
                b-icon(icon="brightness-high-fill" variant="danger")

              b-button(v-else
                      :key="2"
                      @click="onToggleAddToMyDay({ todo, value: true })"
                      variant="light"
                      size="sm"
                      class="mr-1"
                      title="Agregar tarea a mi día")
                b-icon(icon="brightness-high" variant="danger")
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    todolist: {
      type: Array,
      required: false,
      default: () => ([])
    }
  },

  methods: {
    ...mapActions('todo', ['onToggleAddToMyDay', 'onToggleMarkAsImportant']),

    emitSelect (todo) {
      this.$emit('selectToDo', todo)
    },

    emitCheck (todo) {
      this.$emit('checkToDo', todo)
    }
  }
}
</script>

<style lang="scss" scoped>
.b-list-group-item {
  transition: all 1s;
}
.item__text {
  cursor: pointer;
}
</style>
