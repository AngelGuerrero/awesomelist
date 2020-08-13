<template lang="pug">
  #todo(class="w-100 h-100 d-flex")
    to-do-list-create
    .menu
      to-do-menu
    .content(class="flex-grow-1 h-100 p-3")
      to-do-tools

      h1(class="h3" :style="getStyle") {{ getCurrentList.title }}

      to-do-create(@createdToDo="selectToDo")

      to-do-list(:todolist="getUncompletedToDos"
                @selectToDo="selectToDo"
                @checkToDo="completeToDo")

      b-button(v-if="thereAreCompletedToDos"
              variant="primary"
              size="sm"
              class="my-2"
              @click="showCompletedToDos = !showCompletedToDos") {{ getBtnText }}

      to-do-list(v-if="thereAreCompletedToDos"
                v-show="showCompletedToDos"
                :todolist="getCompletedToDos"
                @selectToDo="selectToDo"
                @checkToDo="onToggleToDo"
                :class="{ 'completed': thereAreCompletedToDos }")

      to-do-select-list-control

    .detail
      component(v-if="selectedComponent.name" :is="selectedComponent.name" v-bind="selectedComponent.props")
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

import ToDoMenu from '@/components/ToDo/ToDoMenu'
import ToDoList from '@/components/ToDo/ToDoList'
import ToDoListCreate from '@/components/ToDo/ToDoListCreate'
import ToDoTools from '@/components/ToDo/ToDoTools'
import ToDoSelectListControl from '@/components/ToDo/ToDoSelectListControl'
import ToDoCreate from '@/components/ToDo/ToDoCreate'
import ToDoDetail from '@/components/ToDo/ToDoDetail'
import UserProfile from '@/components/User/UserProfile'

export default {
  components: {
    ToDoMenu,
    ToDoList,
    ToDoTools,
    ToDoSelectListControl,
    ToDoCreate,
    ToDoListCreate,
    //
    // Dynamic components
    ToDoDetail,
    UserProfile
  },

  data: () => ({
    showCompletedToDos: false,
    //
    // This is only the string To Do id
    currentId: null
  }),

  computed: {
    //
    // 'todo' module
    ...mapState('todo', [
      'todos'
    ]),
    ...mapGetters('todo', [
      'getUncompletedToDos',
      'getCompletedToDos',
      'getCurrentList',
      'getCurrentListAccentColor'
    ]),
    //
    // 'ui' module
    ...mapState('ui', [
      'showUserProfileMenu',
      'selectedComponent'
    ]),

    thereAreCompletedToDos () {
      return this.getCompletedToDos.length > 0
    },

    getBtnText () {
      return this.showCompletedToDos ? 'Ocultar tareas completadas' : 'Mostrar tareas completadas'
    },

    showToDoDetail () {
      return this.currentId !== null
    },

    getStyle () {
      const style = {
        color: this.getCurrentList.accentColor
      }
      return style
    }
  },

  // TODO: FIX WATCH PROPERTY
  watch: {
    getUncompletedToDos: {
      deep: true,
      immediate: false,
      handler (todos) {
        // if (todos.length <= 0) return

        // const uncompleteToDo = todos[0]
        // this.currentId = uncompleteToDo.id
        // this.setSelectedComponent({
        //   name: 'ToDoDetail',
        //   props: {
        //     id: this.currentId
        //   }
        // })
      }
    }
  },

  mounted () {
    this.getToDos(this.$store.state.user.currentUser.uid)
  },

  methods: {
    ...mapMutations('ui',
      [
        'playDoneTaskSound',
        'setSelectedComponent'
      ]),

    ...mapActions('todo',
      [
        'getToDos',
        'onToggleToDo'
      ]),

    completeToDo (todo) {
      this.onToggleToDo(todo)
      this.currentId = null
    },

    selectToDo (todo) {
      this.currentId = todo.id

      this.setSelectedComponent({ name: 'ToDoDetail', props: { id: this.currentId } })
    }
  }
}
</script>

<style lang="scss" scoped>
#todo {
  height: 100%;
}

.toDo__title {
  color: rgb(207, 23, 23);
}

.content {
  overflow: auto;
  margin-left: 40px;
  position: relative;

  @media screen and (min-width: 650px) {
    margin-left: 0;
  }
}

.completed {
  opacity: 0.6;
  text-decoration: line-through;
  font-style: italic !important;
}
</style>
