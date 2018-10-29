<template lang="pug">

  .column.container
    //- pre {{ $data }}
    .task__box(v-for="task in list")
      el-checkbox(:label="task.title" v-model="task.checked")
      .task__options
        i.el-icon-more.more__icon

</template>

<script>
export default {
  name: 'ListTodos',

  data () {
    return {
      list: [
        {
          title: 'Create layout for H3 page',
          checked: true
        },
        {
          title: 'Learn Elm',
          checked: true
        },
        {
          title: 'Learn Elixir',
          checked: false
        },
        {
          title: 'Learn Rust',
          checked: false
        },
        {
          title: 'Finish Blog',
          checked: false
        },
        {
          title: 'Upload progress of awesomelist project',
          checked: false
        },
        {
          title: 'This is a task with a loooooooooooooooooooooooooooooong text',
          checked: false
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.task__box {
  border: 1px solid rgb(101, 139, 243);
  border-radius: 5px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .el-checkbox {
    flex-grow: 1;
    margin: 5px 0px;
    padding: 7px;
    overflow: hidden;
  }
}

.more__icon {
  transform: rotate(90deg);
  padding: 8px 5px;
  &:hover {
   cursor: pointer;
   color: red;
  }
}
</style>
