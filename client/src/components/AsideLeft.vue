<template lang="pug">
  //-
  //- Is visible if the 'visible' variable is true
  //-
  //- If the 'mobile' variable is true
  //- this will take all available screen size
  //-
  aside.aside__left.column.between(:class="{ mobile: mobile }" v-show="visible")
    .screen(@click="disappear()")
    .column.start
      header(class="row-v-center between")
        h3.title All projects
        i.plus-icon(class="symb-icon fas fa-plus")

      .projects(class="column")
        a.projects__item(v-for="(project, index) in projects" href="#")
          i.fas.fa-folder
          |  {{ project.title }}

    .project__properties(class="container column between")
      .properties__header(class="column")
        h3.properties__title Project
        p.properties__description Description of the project
      .buttons(class="container")
        div
          el-button(class="btn-large"
                    type="primary"
                    size="small") Show completed tasks
        br
        div
          el-button(class="btn-large"
                    type="danger"
                    size="small"
                    :plain="true") Delete project

</template>

<script>
export default {
  name: 'AsideLeft',

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
      projects:
      [
        {
          title: 'Turing laravel'
        },
        {
          title: 'Regen microframework'
        },
        {
          title: 'Flask projects'
        },
        {
          title: 'Django projects'
        },
        {
          title: 'Learn rust'
        },
        {
          title: 'Learn Go-lang'
        },
        {
          title: 'Create H3 website'
        },
        {
          title: 'Create a sniffer C++ program'
        },
        {
          title: '300 Days of code'
        },
        {
          title: '100 Days of code with Erlang'
        }
      ]
    }
  },

  methods: {
    disappear () {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/partials/variables.scss';

.aside__left {
  border: 1px solid yellow;
  width: $aside-left-width;
  max-width: $aside-left-min-w;
  background-color: white;
}

header {
  padding: 5px 10px;
}

.projects {
  overflow-x: hidden;
  overflow-y: auto;
  height: 50%;

  .projects__item {
    width: 100%;
    padding: 10px;
    text-decoration: none;
    color: #333333;
    &:first-of-type {
      border-top: 1px solid #eee5e8;
    }
    &:hover {
      background-color: #e1eeff;
    }
  }
}

.project__properties {
  overflow-x: hidden;
  overflow-y: auto;
  height: 40%;
}

// overwrite previous classes
.screen {
  background-color: white;
  width: 100%;
  height: 100vh;
  position: fixed;
  z-index: -1;
  opacity: 0.6;
}

.mobile {
  // background-color: #333333;
  // color: #e1eeff;
  position: fixed;
  z-index: 10;
  width: 100%;
  max-width: auto;
  height: 100%;
  top: 0;
}
</style>
