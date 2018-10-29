<template lang="pug">
  #app
    app-navbar
    #main(v-if="mobile")
      app-aside-left(:visible="true" :mobile="true")
      .main__content
        app-createTodo
        app-listTodos
      app-aside-right(:visible="false" size="large")
    #main(v-else)
      .main__content
        app-createTodo
        app-listTodos
    #footer Este es el footer

</template>

<script>
// App components
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
      mobile: true
    }
  },

  created: function () {
    this.resize()
    window.addEventListener('resize', this.resize)
  },

  methods: {
    resize () {
      if (window.innerWidth < 800) {
        this.mobile = true
      } else {
        this.mobile = true
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
  border: 1px solid #333333;
}

#main {
  border: 1px solid tomato;
  overflow-y: auto;
  height: calc(100vh - #{$navbar-total-height});
}

.main__content {
  border: 1px solid green;
  flex-grow: 1;
  overflow-y: auto;
}

#footer {
  padding: $footer-padding 0px;
  text-align: center;
  border: 1px solid #333333;
  background-color: lightblue;
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
