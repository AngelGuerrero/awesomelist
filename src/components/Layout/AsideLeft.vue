<template lang="pug">
  transition(name="fade")
    aside(class="aside__left"
          :class="{ mobile: mobile }"
          v-show="visible")
      .screen(v-show="mobile" @click="disappear()")
      //- app-modal

      //- Show the selected component
      component(:is="selectedComponent")

</template>

<script>
// This aside left component
// is a container for ProjectList and NewProject commponents

// This component will be visible if the 'visible' variable is true
//
// If the 'mobile' variable is true, then
// this will take all available screen size

import EventBus from '@/EventBus'

import projectList from '@/components/Project/ProjectList'
import newProject from '@/components/Project/NewProject'

export default {
  name: 'AsideLeft',

  components: {
    projectList,
    newProject
  },

  props: {
    // show component?
    visible: {
      type: Boolean,
      required: true
    },

    // size of component?
    mobile: {
      type: Boolean,
      required: true
    }
  },

  data () {
    return {
      // Default component
      selectedComponent: 'project-list'
    }
  },

  created () {
    EventBus.$on('change-component', (component) => {
      console.log(`Cambiando al componente: ${component}`)
      this.selectedComponent = component
    })
  },

  methods: {
    // Emit an event for change this
    // component visibility, through EventBus
    disappear () {
      EventBus.$emit('change-aside-left-state')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/partials/variables.scss';

.aside__left {
  width: $aside-left-width;
  min-width: $aside-left-width;
  background-color: $aside-left-background-color;
  color: black;
  overflow-y: auto;
  height: 100%;
}

.screen {
  background-color: white;
  width: 100%;
  height: 100vh;
  position: fixed;
  z-index: -1;
  opacity: 0.4;
}

.mobile {
  position: fixed;
  z-index: 10;
  max-width: auto;
  height: calc(100vh - #{$navbar-height});
  top: calc(#{navbar-height});
}

@media screen and (max-width: 425px) {
  .mobile {
    width: 100%;
    max-width: 100%;
  }
}
</style>
