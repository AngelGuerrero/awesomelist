<template lang="pug">
  #app(class="column between")
    app-navbar
    #main
      app-aside-left(:visible="asideLeft" :mobile="mobile")
      .main__content
        app-createTodo
        app-listTodos
      app-aside-right(:visible="asideRight" :mobile="mobile")
    #footer Awesomelist - {{ date.getFullYear() }}

</template>

<script>
// App components
import EventBus from './EventBus'
import Navbar from './components/Navbar'
import CreateTodo from './components/CreateTodo'
import ListTodos from './components/ListTodos'
import AsideLeft from './components/AsideLeft'
import AsideRight from './components/AsideRight'

export default {
  name: 'App',

  components: {
    AppNavbar: Navbar,
    AppCreateTodo: CreateTodo,
    AppListTodos: ListTodos,
    AppAsideRight: AsideRight,
    AppAsideLeft: AsideLeft
  },

  data () {
    return {
      mobile: false,
      asideLeft: true,
      asideRight: false,
      date: ''
    }
  },

  created: function () {
    this.date = new Date()

    // Check device width
    if (window.innerWidth < 800) {
      this.mobile = true
      this.asideLeft = false
    }

    // Check and add a listener when resize window
    this.resize()
    window.addEventListener('resize', this.resize)

    // Listen global events from components through EventBus
    EventBus.$on('change-aside-left-state', () => { this.asideLeft = !this.asideLeft })

    EventBus.$on('change-aside-right-state', () => { this.asideRight = !this.asideRight })
  },

  methods: {
    resize () {
      if (window.innerWidth < 800) {
        this.mobile = true
        this.asideLeft = false
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
  height: calc(99vh - #{$navbar-height} - #{$footer-padding });
}

.main__content {
  background-color: lightblue;
  flex-grow: 1;
  overflow-y: auto;
  height: 100%;
}

#footer {
  padding: $footer-padding 0px;
  text-align: center;
  color: #ffffff;
  background-color: $wrapper-header-background-color;
}

@media screen and (min-width: 800px) {
  #main {
    // background-color: #333333;
    display: flex;
  }

  .main__content {
    width: $main-content-width;
    min-width: $main-content-min-w;
  }
}
</style>
