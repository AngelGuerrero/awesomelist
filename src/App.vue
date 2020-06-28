<template lang="pug">
  #app(class="column between")
    navbar
    #main
      //- aside-left(:visible="asideLeft" :mobile="mobile")
      .main__content
        todo-create
        todo-list
      //- aside-right(:visible="asideRight" :mobile="mobile")
    #footer Awesomelist - {{ date.getFullYear() }}
</template>

<script>
import EventBus from './EventBus'

// Todo components
import Navbar from './components/Layout/Navbar'
import TodoCreate from './components/Todo/TodoCreate'
import TodoList from './components/Todo/TodoList'
// import Sidebar from './components/Layout/Sidebar'
// import AsideRight from './components/Layout/AsideRight'

export default {
  name: 'App',

  components: {
    Navbar,
    TodoCreate,
    TodoList
    // AppdeRight,
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
      asideRight: false,

      // Date of the site
      date: ''
    }
  },

  created: function () {
    this.date = new Date()

    // Check and add a listener when resize window
    if (window.innerWidth < 700) {
      this.asideLeft = false
    } else {
      this.asideLeft = true
    }

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
  overflow-y: auto;
  height: calc(100vh - #{$navbar-height} - #{$footer-padding });
  display: flex;
}

.main__content {
  width: 100%;;
  height: 100%;
  padding: 10px;
  overflow-y: auto;
}

#footer {
  padding: $footer-padding 0px;
  text-align: center;
  color: #ffffff;
  background-color: $wrapper-header-background-color;
}
</style>
