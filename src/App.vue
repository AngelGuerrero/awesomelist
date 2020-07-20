<template lang="pug">
  #app(class="column between")
    //- === Sounds ===
    //-
    //- Done Task Sound
    audio(id="elDoneTaskSound")
      source(src="@/assets/sounds/doneTask.mp3" type="audio/mp3")

    audio(id="elAddTaskSound")
      source(src="@/assets/sounds/addedTask.mp3" type="audio/mp3")

    navbar
    #main
      .main__content
        to-do
    #footer By Ángel Guerrero
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Navbar from './components/Layout/Navbar'
import Sidebar from './components/Layout/Sidebar'

import ToDo from './components/ToDo/ToDo'

export default {
  components: {
    Navbar,
    Sidebar,
    ToDo
  },

  computed: {
    ...mapState('ui', ['notification', 'doneTaskSound', 'addTaskSound'])
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
    }

  },

  created () {
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

    setInitialList () {
      const list = this.$store.state.todo.categories.DEFAULT
      this.$store.commit('todo/setCurrentList', list)
    }
  }
}
</script>

<style lang="scss">
#app {
  height: 100vh;
}

#main {
  overflow: hidden;
  height: calc(100vh - #{$navbar-height} - #{$footer-padding });
  display: flex;
}

.main__content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

#footer {
  padding: $footer-padding 0px;
  text-align: center;
  color: #ffffff;
  background-color: $header_bg_color;
}
</style>
