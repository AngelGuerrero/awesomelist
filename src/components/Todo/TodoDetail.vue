<template lang="pug">
  sidebar(@close="close")
    //- If no data was received
    .wrapper(v-if="!todo")
      h3 No data to show

    //- Main todo detail content
    .wrapper(v-else)
      //- Modal
      vs-dialog(overflow-hidden blur prevent-close v-model="modal.active")
        template(#header)
          h6(class="font-weight-bolder text-danger") Eliminar tarea
        div(class="w-100 h-100 d-flex flex-column justify-content-center align-items-center")
          p ¿Desea eliminar la tarea '{{ todo.title }}' ?
        template(#footer)
          div(class="d-flex justify-content-between")
            vs-button(primary transparent @click="modal.active = false") Cancelar
            vs-button(danger transparent @click="deleteTodo") Confirmar

      //- Content
      .sidebar__content(class="container")
        .content__header
          b-list-group
            //- Tarea
            b-list-group-item(button class="list-item mb-0")
              vs-checkbox(class="mr-3")
              .editable(contenteditable
                        v-text="todo.title"
                        class="py-1 radius w-100 font-weight-bolder")

        b-list-group
          //- Agregar a mi día
          b-list-group-item(button
                            class="list-item text-muted")
            b-icon(icon="brightness-high" class="h5 mb-0 mr-4")
            span Agregar a mi día

          //- Tiempo
          b-list-group(class="my-2")
            b-list-group-item(button
                              class="text-muted ")
              b-icon(icon="bell" class="text-muted h5 mb-0 mr-4")
              span Recordarme
            b-list-group-item(button
                              class="text-muted ")
              b-icon(icon="calendar-date" class="text-muted h5 mb-0 mr-4")
              span Agregar fecha de vencimiento
            b-list-group-item(button
                              class="text-muted ")
              b-icon(icon="arrow-repeat" class="text-muted h5 mb-0 mr-4")
              span Repetir

          //- Categoría
          b-list-group-item(button
                            class="text-muted list-item")
            b-icon(icon="tag" class="text-muted h5 mb-0 mr-4")
            span Agregar una categoría

          b-list-group-item(button
                            class="text-muted list-item")
            b-icon(icon="paperclip" class="text-muted h5 mb-0 mr-4")
            span Agregar archivo

          //- Nota de tarea
          b-list-group-item(class="item-editable border d-flex my-1 rounded p-2")
            textarea(placeholder="Agregar nota" class="w-100")
            div
              p Actualizado: hace unos segundos

      //- Footer
      .sidebar__footer(class="row-v-center between")
        //- Close component
        b-icon(icon="arrow-bar-right" class="h4 mb-0" @click="close")
        //- Information about todo
        p.mb-0 {{ todo.createdBy }}
        //- Delete todo
        b-button(variant="danger" size="sm" @click="modal.active = true")
          b-icon(icon="trash-fill")
</template>

<script>
import Sidebar from '@/components/Layout/Sidebar'
import { mapActions } from 'vuex'

export default {
  components: {
    Sidebar
  },

  props: {
    todo: {
      type: Object,
      required: false,
      default: null
    }
  },

  data () {
    return {
      modal: {
        active: false
      }
    }
  },

  watch: {
    todo (val) {
      console.log(val)
    }
  },

  methods: {
    ...mapActions('todo', ['deleteTodoById']),

    close () {
      this.$emit('close')
    },

    deleteTodo () {
      this.deleteTodoById(this.todo.id)
      this.modal.active = false
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
$sidebar-footer-hight: 40px;
$background-color: #f5f5f5;

.wrapper {
  height: 100%;
  overflow-y: auto;
  background-color: $background-color;
}

.sidebar__content {
  position: relative;
  height: calc(100% - #{$sidebar-footer-hight});
  overflow-y: auto;
}

.content__header {
  width: 100%;
  position: sticky;
  z-index: 999;
  top: 0;
  right: 0;
  background-color: $background-color;
}

.list-item {
  display: flex !important;
  align-items: center;
  margin: 7px 0;
  background: white !important;
  border: 1px solid #e9e9e9 !important;
  border-radius: 3px !important;
}

.editable {
  border: 1px solid transparent;

  &:hover {
    background-color: #f5f5f5;
    cursor: text;
  }

  &:focus {
    background-color: #f5f5f5;
    border-color: black;
  }
}

.item-editable {
  display: flex !important;
  flex-direction: column;
  padding: 0;
  &:hover {
    border-color: #999999 !important;
  }
  &:focus-within {
    border-color: #4971e5 !important;
  }
  textarea {
    width: 100% !important;
    padding: 5px;
    border: 1px solid transparent;
    resize: none;
    &::placeholder {
      font-style: italic;
    }
  }
  p {
    margin: 5px 0;
    font-size: 12px;
    color: #999999;
  }
}

.sidebar__footer {
  width: 100%;
  height: $sidebar-footer-hight;
  position: absolute;
  z-index: 999;
  right: 0;
  bottom: 0;
  padding: 0 15px;
  border-top: 1px solid #e9e9e9;
}
</style>
