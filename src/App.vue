<template lang="pug">
  #app(class="column between")
    //- === Sounds ===
    //-
    //- Done Task Sound
    audio(id="elDoneTaskSound" hidden)
      source(src="@/assets/sounds/doneTask.mp3" type="audio/mp3")

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
    ...mapState('ui', ['notification', 'doneTaskSound'])
  },

  watch: {
    notification (val) {
      if (val.show) this.$vs.notification(val)
    },

    doneTaskSound: {
      deep: true,
      immediate: true,
      handler (sound) {
        if (sound.play) {
          this.$el.querySelector('#elDoneTaskSound').play()
          this.playDoneTaskSound(false)
        }
      }
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
