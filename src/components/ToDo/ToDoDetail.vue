<template lang="pug">
  sidebar(@close="close")
    transition(name="fade-in")
      .wrapper(:key="1" v-if="!todo" class="container row-v-center row-h-center")
        b-spinner.mr-3
        | Cargando...
      //- Main todo detail content
      .wrapper(:key="2" v-else)
        //- Modal
        vs-dialog(overflow-hidden blur prevent-close v-model="modal.active")
          template(#header)
            h6(class="font-weight-bolder text-danger") Eliminar tarea

          div(class="w-100 h-100 d-flex flex-column justify-content-center align-items-center")
            p ¿Desea eliminar la tarea '{{ todo.title }}' ?

          template(#footer)
            div(class="d-flex justify-content-between")
              vs-button(primary transparent @click="modal.active = false") Cancelar
              vs-button(danger transparent @click="deleteToDo") Confirmar

        //- Content
        .sidebar__content.container
          .content__header
            b-list-group
              //- Tarea
              b-list-group-item(button class="list-item mb-0")
                vs-checkbox(v-model="todo.done" @change="toggleToDoCompleted" class="mr-3")
                .todotitle__editable(contenteditable
                                    v-text="todo.title"
                                    @blur="onEditToDoTitle"
                                    @keyup.enter="endEditToDoTitle"
                                    class="py-1 radius w-100 font-weight-bolder")

          div
            //- Related to 'Add to my day'
            b-list-group.my-2
              b-list-group-item(button @click="toMyDay()" :variant="getToDoToMyDayVariant")
                b-icon(icon="brightness-high" :variant="getToDoToMyDayVariant" class="h5 mb-0 mr-4")
                span {{ getToDoToMyDayInformation }}

            //- Related to 'Mark as important'
            b-list-group.my-2
              b-list-group-item(button @click="markAsImportant()" :variant="getToDoImportantVariant")
                b-icon(icon="star" :variant="getToDoImportantVariant" class="h5 mb-0 mr-4")
                span {{ getToDoImportantInformation }}

            //- Related to 'Due Date'
            b-list-group.my-2
              //- DueDate: Remind me
              b-list-group-item(button class="text-muted")
                b-icon(icon="bell" class="text-muted h5 mb-0 mr-4")
                span Recordarme

              //- DueDate: Due Time Widget
              b-list-group(class="duedate__container rounded-0" :class="{ 'enfasis-border': duedate.visible }")
                b-list-group-item(v-if="!duedate.visible"
                                  button
                                  @click="toggleDueDate"
                                  class="text-muted border-top-0 border-bottom-0 rounded-0")
                  b-icon(icon="calendar-date" :class="getDueDateStatusClass" class="h5 mb-0 mr-4")
                  span(:class="getDueDateStatusClass") {{ getInformationDueDate }}

                .duedate__calendar(v-else
                                  class="column-v-center column-h-center p-2")
                  div(class="w-100 row-v-center")
                    b-button(variant="danger"
                            size="sm"
                            @click="toggleDueDate"
                            class="my-2 mx-2 w-100") Cancelar
                    b-button(v-if="duedate.value"
                            variant="success"
                            size="sm"
                            @click="addDueTime"
                            class="my-2 mx-2 w-100") Aceptar

                  b-calendar(v-model="duedate.value"
                            @context="onContext"
                            locale="es-MX"
                            class="w-100 column-v-center column-h-center")
              //- DueDate: Repeat
              b-list-group-item(button class="text-muted ")
                b-icon(icon="arrow-repeat" class="text-muted h5 mb-0 mr-4")
                span Repetir

            //- Related to 'Category'
            b-list-group.my-2
              b-list-group-item(button class="text-muted")
                b-icon(icon="tag" class="text-muted h5 mb-0 mr-4")
                span Agregar una categoría

            //- Related to 'Adjunt file'
            b-list-group.my-2
              b-list-group-item(button class="text-muted")
                b-icon(icon="paperclip" class="text-muted h5 mb-0 mr-4")
                span Agregar archivo

            //- Related to 'Notes'
            b-list-group.my-2
              b-list-group-item(button class="bg-white my-1 h-100 rounded p-2")
                div(v-if="editing.note" class="w-100 mb-3")
                  b-button(variant="default"
                          size="sm"
                          class="text-dark w-50"
                          @click="onCancelEditToDoNote") Cancelar
                  b-button(variant="default"
                          size="sm"
                          class="text-success w-50"
                          @click="onEditToDoNote") Guardar
                .todonote__editable(contenteditable
                                    v-html="todo.note || 'Agregar una nota'"
                                    @focus="onFocusToDoNote"
                                    @keyup.enter="endEditToDoNote"
                                    class="w-100 h-100")
                div.my-3
                    p.text-muted {{ getUpdatedDifference }}

        //- Footer
        .sidebar__footer.row-v-center.jc-between
          //- Close component
          b-button(size="sm" variant="light" @click="close")
            b-icon(icon="arrow-bar-right")

          //- Information about todo
          p.mb-0 {{ getCreationToDoInformation }}

          //- Delete todo
          b-button(size="sm" variant="light" @click="modal.active = true")
            b-icon(icon="trash" variant="danger")

</template>

<script>
import moment from 'moment'
import Sidebar from '@/components/Layout/Sidebar'
import { mapActions } from 'vuex'
import { db } from '@/data/FirebaseConfig'

export default {
  components: {
    Sidebar
  },

  props: {
    id: {
      type: String,
      required: false,
      default: null
    }
  },

  data () {
    return {
      todo: null,

      modal: {
        active: false
      },

      duedate: {
        visible: false,
        value: '',
        context: null
      },

      editing: {
        note: false
      }
    }
  },

  computed: {
    getToDoToMyDayInformation () {
      return this.todo.isOnMyDay ? 'Tarea para el día de hoy' : 'Agregar a mi día'
    },

    getToDoToMyDayVariant () {
      return this.todo.isOnMyDay ? 'primary' : 'default'
    },

    getToDoImportantInformation () {
      return this.todo.isImportant ? 'Tarea importante' : 'Marcar tarea como importante'
    },

    getToDoImportantVariant () {
      return this.todo.isImportant ? 'primary' : 'default'
    },

    getInformationDueDate () {
      const today = moment().format('YYYY-MM-DD')

      return this.todo.duedate
        ? (this.todo.duedate.ymd === today

          ? 'La tarea vence hoy'
          : this.todo.duedate.formatted)

        : 'Agregar fecha de vencimiento'
    },

    getDueDateStatusClass () {
      if (!this.todo.duedate) return 'text-muted'

      const now = moment()

      const duedate = moment(this.todo.duedate.ymd)
      const hours = duedate.diff(now, 'hours')

      return hours > 0 ? 'text-success' : 'text-danger'
    },

    getCreationToDoInformation () {
      const created = new Date(this.todo.created)
      const m = moment(created.seconds).format('DD MMMM YYYY')
      return `Tarea creada el: ${m}`
    },

    getToDoNoteInformation () {
      return this.todo.note ? this.todo.note : 'Agregar una nota'
    },

    getUpdatedDifference () {
      if (!this.todo.lastUpdated) return ''

      let difference

      if (this.todo.lastUpdated) {
        const date = new Date(this.todo.lastUpdated.seconds * 1000)
        difference = moment(date).fromNow()
      } else {
        difference = moment(this.todo.lastUpdated).fromNow()
      }

      return `Actualizado: ${difference}`
    }
  },

  watch: {
    id: {
      deep: true,
      immediate: true,
      handler (id) {
        this.$bind('todo', db.collection('todos').doc(id))
      }
    }
  },

  created () {
    moment.locale('es-MX')
  },

  mounted () {
    this.duedate.value = this.todo ? (this.todo.duedate ? this.todo.duedate.ymd : '') : ''
  },

  methods: {
    ...mapActions('todo', [
      'deleteToDoById',
      'updateToDoById',
      'onToggleAddToMyDay',
      'onToggleMarkAsImportant'
    ]),

    onEditToDoTitle (ev) {
      const txt = ev.target.innerText.trim()

      this.todo.title = txt
      this.todo.lastUpdated = new Date()

      this.updateToDoById(this.todo)
    },

    endEditToDoTitle () {
      this.$el.querySelector('.todotitle__editable').blur()
    },

    toMyDay () {
      if (this.todo.isOnMyDay === undefined) return this.onToggleAddToMyDay({ todo: this.todo, value: true })

      this.onToggleAddToMyDay({ todo: this.todo, value: !this.todo.isOnMyDay })
    },

    markAsImportant () {
      if (this.todo.isImportant === undefined) return this.onToggleMarkAsImportant({ todo: this.todo, value: true })

      this.onToggleMarkAsImportant({ todo: this.todo, value: !this.todo.isImportant })
    },

    onFocusToDoNote () {
      const editable = this.$el.querySelector('.todonote__editable')
      editable.innerText = this.todo.note ? this.todo.note : ''
      this.editing.note = true
    },

    onEditToDoNote () {
      const editable = this.$el.querySelector('.todonote__editable')
      const txt = editable.innerText

      if ((txt === '') || (txt === this.todo.note)) {
        return this.onCancelEditToDoNote()
      }

      this.todo.note = txt
      this.todo.lastUpdated = new Date()

      this.note = null
      this.editing.note = false

      this.updateToDoById(this.todo)
    },

    endEditToDoNote (ev) {
      //
      // Control + Enter
      if (ev.ctrlKey) {
        this.onEditToDoNote(ev)
        return this.$el.querySelector('.todonote__editable').blur()
      }
    },

    onCancelEditToDoNote () {
      const editable = this.$el.querySelector('.todonote__editable')

      this.editing.note = false
      editable.innerText = this.todo.note ? this.todo.note : 'Agregar una nota'
      editable.blur()
    },

    onContext (ctx) {
      this.duedate.context = ctx
    },

    toggleToDoCompleted () {
      this.updateToDoById(this.todo)

      if (this.todo.done) {
        this.$store.commit('ui/playDoneTaskSound', true)
        this.close()
      }
    },

    toggleDueDate () {
      if (this.todo.duedate) {
        this.duedate.value = this.todo.duedate.ymd
      }

      this.duedate.visible = !this.duedate.visible
    },

    todoToMyDay (value) {
      this.todo.isOnMyDay = value
      this.updateToDoById(this.todo)
    },

    addDueTime () {
      const duedate = {
        ymd: this.duedate.context.selectedYMD,
        date: this.duedate.context.selectedDate,
        formatted: this.duedate.context.selectedFormatted
      }
      this.todo.duedate = duedate
      this.todo.lastUpdated = new Date()

      this.updateToDoById(this.todo)
      this.toggleDueDate()
    },

    deleteToDo () {
      this.deleteToDoById(this.todo.id)
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

.list-group-item {
  transition: all 2s;
}

.enfasis-border {
  border: 1px solid #5d9eff !important;
  box-shadow: 0px 0px 5px 0px #a6f5ff !important;
}

.wrapper {
  height: 100%;
  overflow-y: auto;
  background-color: $sidebar_bg_light;
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
  background-color: $sidebar_bg_light;
}

.list-item {
  display: flex !important;
  align-items: center;
  margin: 7px 0;
  background: white !important;
  border: 1px solid #e9e9e9 !important;
  border-radius: 3px !important;
}

.todotitle__editable {
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

.todonote__editable {
  white-space: pre-line;
  padding: 10px;
  border: 1px solid transparent;

  &:focus-within {
    @extend .enfasis-border;
    font-style: normal;
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

.duedate__container {
  background: white !important;
  background-color: white !important;
}
</style>
