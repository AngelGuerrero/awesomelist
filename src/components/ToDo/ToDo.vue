<template lang="pug">
#todo.w-100.h-100.d-flex
  .menu
    to-do-menu
  .content.flex-grow-1.h-100.p-3
    h1.h3(:style='getStyle') {{ getCurrentList.title }}

    to-do-create(@createdToDo='selectToDo')

    to-do-list(
      :todoList='list',
      @selectToDo='selectToDo',
      @checkToDo='completeToDo')

  .detail
    component(
      v-if='selectedComponent.name',
      :is='selectedComponent.name',
      v-bind='selectedComponent.props')
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

import ToDoMenu from '@/components/ToDo/ToDoMenu'
import ToDoList from '@/components/ToDo/ToDoList'
import ToDoCreate from '@/components/ToDo/ToDoCreate'
import ToDoDetail from '@/components/ToDo/ToDoDetail'
import UserProfile from '@/components/User/UserProfile'

export default {
  components: {
    ToDoMenu,
    ToDoList,
    ToDoCreate,
    //
    // Dynamic components
    ToDoDetail,
    UserProfile
  },

  props: {
    list: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      // showCompletedToDos: false,
      //
      // This is only the string To Do id
      currentId: null
    }
  },

  computed: {
    //
    // 'todo' module
    ...mapState('todo', ['todos']),
    ...mapGetters('todo', [
      // 'getUncompletedToDos',
      'getCompletedToDos',
      'getCurrentList',
      'getCurrentListAccentColor'
    ]),
    //
    // 'ui' module
    ...mapState('ui', ['showUserProfileMenu', 'selectedComponent']),

    thereAreCompletedToDos () {
      return this.getCompletedToDos.length > 0
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

  mounted () {
    this.getToDos(this.$store.state.user.currentUser.uid)
  },

  methods: {
    ...mapMutations('ui', ['playDoneTaskSound', 'setSelectedComponent']),

    ...mapActions('todo', ['getToDos', 'onToggleToDo']),

    completeToDo (todo) {
      this.onToggleToDo(todo)
      this.currentId = null
    },

    selectToDo (todo) {
      this.currentId = todo.id

      this.setSelectedComponent({
        name: 'ToDoDetail',
        props: { id: this.currentId }
      })
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

.btn__bg {
  background-color: $header_bg_color;
  border: none;
}
</style>
