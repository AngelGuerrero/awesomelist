<template lang="pug">
  sidebar(@close="close")
    .wrapper(v-if="!todo" class="container row-v-center row-h-center")
      b-spinner.mr-3
      | Cargando...

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
      .sidebar__content.container
        .content__header
          b-list-group
            //- Tarea
            b-list-group-item(button class="list-item mb-0")
              vs-checkbox(v-model="todo.done" @change="toggleTodoCompleted" class="mr-3")
              .editable(contenteditable
                        v-text="todo.title"
                        @blur="onEditTodoTitle"
                        @keyup.enter="endEditTodoTitle"
                        class="py-1 radius w-100 font-weight-bolder")

        b-list-group
          //- Add to my day
          b-list-group-item(button class="list-item text-muted")
            b-icon(icon="brightness-high" class="h5 mb-0 mr-4")
            span Agregar a mi día

          //- Time
          b-list-group.my-2
            //- Remind me
            b-list-group-item(button class="text-muted")
              b-icon(icon="bell" class="text-muted h5 mb-0 mr-4")
              span Recordarme

            //- Due Time
            b-list-group(class="duetime__container rounded-0" :class="{ 'enfasis-border': duetime.visible }")
              b-list-group-item(v-if="!duetime.visible"
                                button
                                @click="toggleDuetime"
                                class="text-muted border-top-0 border-bottom-0 rounded-0")
                b-icon(icon="calendar-date" :class="getDuetimeStatusClass" class="h5 mb-0 mr-4")
                span(:class="getDuetimeStatusClass") {{ getInformationDuetime }}

              .duetime__calendar(v-else
                                class="column-v-center column-h-center p-2")
                div(class="w-100 row-v-center")
                  b-button(variant="danger"
                          size="sm"
                          @click="toggleDuetime"
                          class="my-2 mx-2 w-100") Cancelar
                  b-button(v-if="duetime.value"
                          variant="success"
                          size="sm"
                          @click="addDueTime"
                          class="my-2 mx-2 w-100") Aceptar

                b-calendar(v-model="duetime.value"
                          @context="onContext"
                          locale="es-MX"
                          class="w-100 column-v-center column-h-center")
            //- Repeat
            b-list-group-item(button class="text-muted ")
              b-icon(icon="arrow-repeat" class="text-muted h5 mb-0 mr-4")
              span Repetir

          //- Category
          b-list-group-item(button class="list-item text-muted")
            b-icon(icon="tag" class="text-muted h5 mb-0 mr-4")
            span Agregar una categoría

          //- Adjunt file
          b-list-group-item(button class="list-item text-muted")
            b-icon(icon="paperclip" class="text-muted h5 mb-0 mr-4")
            span Agregar archivo

          //- Notes
          b-list-group-item(class="item-editable border d-flex my-1 rounded p-2")
            textarea(v-model="note"
                    @focus="onFocusTodoNote"
                    @keyup.enter="endEditTodoNote"
                    @blur="onEditTodoNote"
                    class="text-area w-100"
                    :placeholder="getTodoNoteInformation")
            div
              p {{ getUpdatedDifference }}

      //- Footer
      .sidebar__footer.row-v-center.jc-between
        //- Close component
        b-icon(icon="arrow-bar-right" class="h4 mb-0" @click="close")

        //- Information about todo
        p.mb-0 {{ getCreationTodoInformation }}

        //- Delete todo
        b-button(variant="danger" size="sm" @click="modal.active = true")
          b-icon(icon="trash-fill")

</template>

<script>
import moment from 'moment'
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
      },

      duetime: {
        visible: false,
        value: '',
        context: null
      },

      note: ''
    }
  },

  computed: {
    getInformationDuetime () {
      const today = moment().format('YYYY-MM-DD')

      return this.todo.duetime
        ? (this.todo.duetime.ymd === today

          ? 'La tarea vence hoy'
          : this.todo.duetime.formatted)

        : 'Agregar fecha de vencimiento'
    },

    getDuetimeStatusClass () {
      if (!this.todo.duetime) return 'text-muted'

      const duetime = moment(this.duetime.value)
      const now = moment().format()
      const diff = duetime.diff(now, 'days')

      return diff >= 0 ? 'text-success' : 'text-danger'
    },

    getCreationTodoInformation () {
      const created = new Date(this.todo.created)
      const m = moment(created.seconds).format('DD MMMM YYYY')
      return `Tarea creada el: ${m}`
    },

    getTodoNoteInformation () {
      return this.todo.note ? this.todo.note : 'Agregar una nota'
    },

    getUpdatedDifference () {
      const lastUpdated = this.todo.lastUpdated
      let difference

      if (lastUpdated.seconds) {
        const date = new Date(this.todo.lastUpdated.seconds * 1000)
        difference = moment(date).fromNow()
      } else {
        difference = moment(lastUpdated).fromNow()
      }

      return `Actualizado: ${difference}`
    }
  },

  watch: {
    todo (val) {
      this.duetime.value = val.duetime.ymd
    }
  },

  created () {
    moment.locale('es-MX')
  },

  mounted () {
    this.duetime.value = this.todo ? (this.todo.duetime ? this.todo.duetime.ymd : '') : ''
  },

  methods: {
    ...mapActions('todo', ['deleteTodoById', 'updateTodoById']),

    onEditTodoTitle (evt) {
      const txt = evt.target.innerText.trim()

      this.todo.title = txt
      this.todo.lastUpdated = new Date()

      this.updateTodoById(this.todo)
    },

    endEditTodoTitle () {
      this.$el.querySelector('.editable').blur()
    },

    onFocusTodoNote () {
      if (this.todo.note) {
        this.note = this.todo.note
      }
    },

    onEditTodoNote () {
      this.todo.note = this.note.trim()
      this.todo.lastUpdated = new Date()
      this.note = null

      this.updateTodoById(this.todo)
    },

    endEditTodoNote () {
      this.$el.querySelector('.text-area').blur()
    },

    onContext (ctx) {
      this.duetime.context = ctx
    },

    toggleTodoCompleted () {
      this.updateTodoById(this.todo)
    },

    toggleDuetime () {
      this.duetime.visible = !this.duetime.visible
    },

    addDueTime () {
      const duetime = {
        ymd: this.duetime.context.selectedYMD,
        date: this.duetime.context.selectedDate,
        formatted: this.duetime.context.selectedFormatted
      }
      this.todo.duetime = duetime
      this.todo.lastUpdated = new Date()

      this.updateTodoById(this.todo)
      this.toggleDuetime()
    },

    deleteTodo () {
      this.deleteTodoById(this.todo.id)
      this.modal.active = false
      this.close()
    },

    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
$sidebar-footer-hight: 40px;
$background-color: #f5f5f5;

.enfasis-border {
  border: 1px solid #5d9eff !important;
  box-shadow: 0px 0px 5px 0px #a6f5ff !important;
}

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

.duetime__container {
  background: white !important;
  background-color: white !important;
}
</style>
