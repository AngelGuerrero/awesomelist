<template lang="pug">
#dashboard
  //- === Sounds ===
  //-
  //- Done Task Sound
  audio#elDoneTaskSound(hidden)
    source(src='@/assets/sounds/doneTask.mp3', type='audio/mp3')

  audio#elAddTaskSound(hidden)
    source(src='@/assets/sounds/addedTask.mp3', type='audio/mp3')
  //- =============

  navbar
  tool-bar(@toggleCompletedToDos='onToggleCompletedToDos')
  .dashboard__content
    to-do(:list='toDoList')
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import Navbar from '@/components/Layout/Navbar'
import ToDo from '@/components/ToDo/ToDo'
import ToolBar from '@/components/Tools/ToolBar'

export default {
  components: {
    ToDo,
    Navbar,
    ToolBar
  },

  provide () {
    return {
      isCompletedList: () => this.isCompletedList
    }
  },

  data () {
    return {
      toDoList: [],
      isCompletedList: false
    }
  },

  computed: {
    ...mapState('ui', ['notification', 'doneTaskSound', 'addTaskSound']),

    ...mapGetters('todo', ['getUncompletedToDos', 'getCompletedToDos'])
  },

  watch: {
    notification (val) {
      if (val.show) this.$vs.notification(val)
    },

    doneTaskSound (val) {
      if (val) {
        this.$el.querySelector('#elDoneTaskSound').play()
      }
    },

    addTaskSound (val) {
      this.$el.querySelector('#elAddTaskSound').play()
    },

    getUncompletedToDos (val) {
      if (!val) return
      this.toDoList = val
    }
  },

  created () {
    this.listenWindowResize()
    this.setInitialList()
  },

  mounted () {
    const doneTaskSound = this.$el.querySelector('#elDoneTaskSound')
    doneTaskSound.addEventListener('timeupdate', _ => {
      if (Math.floor(doneTaskSound.currentTime) === 1) {
        doneTaskSound.pause()
        doneTaskSound.currentTime = 0
        this.playDoneTaskSound(false)
      }
    })
  },

  methods: {
    ...mapMutations('ui', ['playDoneTaskSound']),

    ...mapActions('ui', ['listenWindowResize']),

    setInitialList () {
      const list = this.$store.state.todo.categories.DEFAULT
      this.$store.commit('todo/setCurrentList', list)
    },

    onToggleCompletedToDos (value) {
      this.toDoList = value ? this.getCompletedToDos : this.getUncompletedToDos
      this.isCompletedList = value
    }
  }
}
</script>

<style lang="scss" scoped>
#dashboard {
  height: 100%;
  overflow: hidden;
}
.dashboard__content {
  height: calc(100vh - #{$navbar-height});
  position: relative;
}
</style>
