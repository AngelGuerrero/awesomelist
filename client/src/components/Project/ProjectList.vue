<template lang="pug">
  .project(class="column between")
    .project__header(class="grow-1 row-v-center between container")
      h3.title All projects
      i.plus-icon(class="symb-icon fas fa-plus"
                  @click="changeComponent")

    .project__list(class=" grow-10 column")
      a.list__item(v-for="(project, index) in projects")
        i.fas.fa-folder
        |  {{ project.title }}

    .project__properties(class="grow-1 container column between")
      .properties__header
        h3.properties__title Project
        p.properties__description Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, est? Minima enim ducimus expedita. Voluptate quia ut ea dicta, esse nam fugit pariatur, similique doloribus iste fuga cumque. Beatae, fugiat?
      .buttons
        el-button(class="btn-large" type="danger" size="small" :plain="true") Delete project

</template>

<script>
import EventBus from '@/EventBus'

export default {
  name: 'ProjectList',

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
          title: 'Create H3 website'
        },
        {
          title: 'Create H3 website'
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
    changeComponent () {
      EventBus.$emit('change-component', 'new-project')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/partials/variables.scss';

.project {
  height: 100%;

  &__header {
    max-height: 50px;
    background-color: #aa51fd;
    color: white;
  }

  &__list {
    overflow-y: auto;
    max-height: 50%;
    background-color: white;
    color: darken($color: $wrapper-header-background-color, $amount: 20);

    .list__item {
      border-top: 1px solid #f1f1f1;
      padding: 7px;
      &:hover {
        background-color: $wrapper-header-background-color;
        color: white;
        cursor: pointer;
      }
    }
  }

  &__properties {
    background-color: $main-aside-right-background-color;
    color: white;
    overflow-y: auto;

    .buttons {
      padding: 10px 0px;
    }
  }
}

</style>
