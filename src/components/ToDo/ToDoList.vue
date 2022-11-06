<template lang="pug">
.toDoList__component
  .p-5.column-v-center.column-h-center(v-if='todoList.length <= 0')
    b-icon.h1(icon='archive')
    h5.text-center No hay tareas para mostrar
  //- Wrapper of all To Do's
  b-list-group.pb-5.my-3.animate__fadeInUp(v-else)
    //- To Do Item
    b-list-group-item.bg-light.border.rounded.d-flex.flex-column.my-1.p-0(
      v-for='todo in todoList',
      :key='todo.id',
      button)
      .w-100.d-flex.align-items-center
        //- Checkbox
        vs-checkbox.ml-1.mr-2.p-2(
          v-model='todo.done',
          @change='emitCheck(todo)')
        //- Content
        .item__text.flex-grow-1.p-2(@click='emitSelect(todo)')
          span(:class='{ completed: isCompleted }') {{ todo.title }}
        //- Item options
        .d-flex
          //- Mark as important buttons
          transition(name='fade-up', mode='out-in')
            b-button.mr-1(
              v-if='todo.isImportant',
              :key='1',
              @click='onToggleMarkAsImportant({ todo, value: false })',
              variant='light',
              size='sm',
              title='Desmarcar tarea')
              b-icon(icon='star-fill', variant='warning')

            b-button.mr-1(
              v-else,
              :key='2',
              @click='onToggleMarkAsImportant({ todo, value: true })',
              variant='light',
              size='sm',
              title='Marcar tarea como importante')
              b-icon(icon='star', variant='warning')
          //- Add to my day button
          transition(name='fade-up', mode='out-in')
            b-button.mr-1(
              v-if='todo.isOnMyDay',
              :key='1',
              @click='onToggleAddToMyDay({ todo, value: false })',
              variant='light',
              size='sm',
              title='Quitar de mi día')
              b-icon(icon='brightness-high-fill', variant='warning')

            b-button.mr-1(
              v-else,
              :key='2',
              @click='onToggleAddToMyDay({ todo, value: true })',
              variant='light',
              size='sm',
              title='Agregar tarea a mi día')
              b-icon(icon='brightness-high', variant='danger')
          //- Delete todo
          to-do-confirm-delete(:todo='todo')
</template>

<script>
import ToDoConfirmDelete from '@/components/ToDo/ToDoConfirmDelete'
import { mapActions, mapMutations } from 'vuex'

export default {
  components: {
    ToDoConfirmDelete
  },

  inject: ['isCompletedList'],

  props: {
    todoList: {
      type: Array,
      required: false,
      default: () => []
    }
  },

  computed: {
    isCompleted () {
      return this.isCompletedList()
    }
  },

  methods: {
    ...mapActions('todo', ['onToggleAddToMyDay', 'onToggleMarkAsImportant']),

    ...mapMutations('ui', ['setSelectedComponent']),

    emitSelect (todo) {
      // this.$emit('selectToDo', todo)
      this.setSelectedComponent({
        name: 'ToDoDetail',
        props: {
          id: todo.id
        }
      })
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
  text-overflow: ellipsis;
  white-space: pre-wrap;
  overflow: hidden;
  cursor: pointer;
}

.completed {
  opacity: 0.6;
  text-decoration: line-through;
  font-style: italic !important;
}
</style>
