import { db } from '@/data/FirebaseConfig'
import { firestoreAction } from 'vuexfire'

export default {
  namespaced: true,

  state: {
    //
    // Selected todo is the To Do that currently
    // will be updated or modifyied clicked by the
    // user in TodoList component.
    //
    todo: null,

    todos: []
  },

  getters: {
    getUncompletedTodos (state) {
      return state.todos.filter(ele => !ele.done).sort((a, b) => b.created - a.created)
    },

    getCompletedTodos (state) {
      return state.todos.filter(ele => ele.done).sort((a, b) => a.created - b.created)
    }
  },

  mutations: {
  },

  actions: {
    getTodos: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('todos', db.collection('todos'))
    }),

    saveTodo: async ({ context }, payload) => {
      db.collection('todos')
        .add(payload)
        .then(response => {
          console.log(`Todo created successfully with id: ${response.id}`)
        }).catch(error => {
          console.log(`Something went wront ${error}`)
        })
    },

    getTodoById: async ({ context }, id) => {
      db.collection('todos')
        .doc(id)
        .get()
        .then((response) => {
          console.log(response)
        // commit('setTodo', response)
        }).catch((error) => {
          console.log(`Error getting todo: ${error}`)
        })
    },

    updateTodoById: async ({ context }, todo) => {
      db.collection('todos')
        .doc(todo.id)
        .update(todo)
        .then(_ => console.log('Todo updated successfully'))
        .catch(error => console.log(`Something went wrong: ${error}`))
    },

    deleteTodoById: async ({ context }, id) => {
      db.collection('todos')
        .doc(id)
        .delete()
        .then(() => console.log('Todo deleted successfully'))
        .catch((error) => console.error(`Something went wrong: ${error}`))
    }
  }
}
