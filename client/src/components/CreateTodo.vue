<template lang="pug">
  .create__task.container
    el-input(placeholder="Create new task" v-model="task" size="")
</template>

<script>
export default {
  name: 'CreateTodo',

  data () {
    return {
      task: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.create__task {
  margin: 15px 0px;
}
</style>
