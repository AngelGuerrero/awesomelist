<template lang="pug">
  #app(class="column between")
    navbar
    #main
<<<<<<< HEAD
      .main__content
        todo
    #footer Awesomelist - {{ new Date().getFullYear() }}
=======
      //- aside-left(:visible="asideLeft" :mobile="mobile")
      .main__content(ref="parentSideBar" id="parentx" class="dev")
        todo-create
        todo-list
        aside-right(:visible="asideRight" :mobile="mobile")
    #footer Awesomelist - {{ date.getFullYear() }}
>>>>>>> 40470bb4c92e89c0d3ede2942b47bf161c88546d
</template>

<script>
import Navbar from './components/Layout/Navbar'
<<<<<<< HEAD
import Sidebar from './components/Layout/Sidebar'
=======
import TodoCreate from './components/Todo/TodoCreate'
import TodoList from './components/Todo/TodoList'
// import Sidebar from './components/Layout/Sidebar'
import AsideRight from './components/Layout/AsideRight'
>>>>>>> 40470bb4c92e89c0d3ede2942b47bf161c88546d

import Todo from './components/Todo/Todo'

export default {
  components: {
    Navbar,
<<<<<<< HEAD
    Sidebar,
    Todo
=======
    TodoCreate,
    TodoList,
    AsideRight
    // AppdeLeft
  },

  data () {
    return {
      // If the window size is less than 800 px
      // then change to mobile version
      mobile: false,

      // The aside left loads the projects list
      asideLeft: false,

      // Default aside false
      // It changes to true when loads detail from specify task
      asideRight: true,

      // Date of the site
      date: ''
    }
  },

  created: function () {
    this.date = new Date()

    // Check and add a listener when resize window
    this.asideLeft = window.innerWidth < 700

    this.resize()
    window.addEventListener('resize', this.resize)

    // Listen global events from components through EventBus
    EventBus.$on('change-aside-left-state', () => { this.asideLeft = !this.asideLeft })

    EventBus.$on('change-aside-right-state', () => { this.asideRight = !this.asideRight })
  },

  methods: {
    resize () {
      if (window.innerWidth < 700) {
        this.mobile = true
      } else {
        this.mobile = false
      }
    }
>>>>>>> 40470bb4c92e89c0d3ede2942b47bf161c88546d
  }
}
</script>

<style lang="scss">
// Global styles
@import '@/assets/scss/main.scss';

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
  background-color: $wrapper-header-background-color;
}
</style>
