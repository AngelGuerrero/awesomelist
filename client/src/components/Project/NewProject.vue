<template lang="pug">
  .new
    .new__header(class="row-v-center")
      i.plus-icon(class="symb-icon fas fa-arrow-left"
                  @click="changeComponent")
      h3.title Create a new project
    .new__form(class="container")
      el-form(size="mini")
        el-input(v-model="projectName"
                 class="form__input"
                 placeholder="Enter project name"
                 size="mini")

        el-input(v-model="projectDesc"
                 class="form__input"
                 placeholder="A brief description"
                 size="mini"
                 type="textarea")

        .form__buttons(class="row between")
          el-button(type="danger"
                    :plain="true"
                    size="mini"
                    :disabled="projectName.length <= 0"
                    @click="erase") Cancel

          el-button(type="primary"
                    :plain="true"
                    size="mini"
                    :disabled="projectName.length <= 0"
                    @click="accept") New project
</template>

<script>
import { Notification } from 'element-ui'
import EventBus from '@/EventBus'

export default {
  name: 'NewProject',

  data () {
    return {
      projectName: '',
      projectDesc: ''
    }
  },

  methods: {
    changeComponent () {
      EventBus.$emit('change-component', 'project-list')
    },

    erase () {
      this.projectName = this.projectDesc = ''
    },

    accept () {
      Notification.success({
        title: 'Success',
        message: `New project "${this.projectName}" created succesfully!`,
        showClose: false
      })
      this.erase()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/partials/variables.scss';

.title {
  padding: 0px 10px;
}

.new {
  background-color: white;
  height: 100%;

  &__header {
    background-color: darken($color: $wrapper-header-background-color, $amount: 20);
    color: white;

    .title {
      text-align: center;
    }
  }
}

.new__form {
  padding-top: 10px;
  padding-bottom: 10px;

  .form__input {
    padding: 10px 0px;
  }

  .form__buttons {
    padding: 10px 0px;
  }
}
</style>
