<template lang="pug">

  .container
    .column
      .task__box(v-for="task in pendingList")
        el-checkbox(:label="task.title"
                    v-model="task.checked"
                    @change="completeTask(task)")
        .task__options
          i.el-icon-more.more__icon

    .div(v-show="completedList.length > 0")
      el-button(type="primary" @click="showCompleted = !showCompleted" size="small") Show completed tasks

    .column(v-show="showCompleted")
      .task__box(class="completed" v-for="task in completedList")
        el-checkbox(v-model="task.checked"
                    @change="uncompleteTask(task)")
          span(class="completed") {{ task.title }}
        .task__options
          i.el-icon-more.more__icon

</template>

<script>
export default {
  name: 'TodoList',

  data () {
    return {
      showCompleted: false,
      pendingList: [
        {
          title: 'Learn Elm',
          checked: false
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
          title: 'This is a task with a loooooooooooooooooooooooooooooong text',
          checked: false
        }
      ],
      completedList: []
    }
  },

  methods: {
    completeTask (task) {
      this.completedList.push(task)

      // Remove element from pending list
      this.pendingList = this.pendingList.filter((a) => { return a !== task })
    },

    uncompleteTask (task) {
      // Push element into pending list
      this.pendingList.push(task)

      // Remove element from completed list
      this.completedList = this.completedList.filter((a) => { return a !== task })
    }
  }
}
</script>

<style lang="scss" scoped>
.column {
  padding-top: 15px;
  padding-bottom: 15px;
}

.task__box {
  background-color: white;
  border-radius: 5px;
  margin-bottom: 2px;
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

.completed {
  opacity: 0.6;
  text-decoration: line-through;
  font-style: italic;
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
