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
    getUncompletedTodos: function (state) {
      return state.todos.filter(ele => !ele.done)
    },

    getCompletedTodos: function (state) {
      return state.todos.filter(ele => ele.done)
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

    updateTodoToDone: async ({ context }, { id, done }) => {
      db.collection('todos')
        .doc(id)
        .update({
          done: done,
          lastUpdated: new Date()
        })
        .then(function () {
          console.log('todo updated successfully')
        })
        .catch(function (error) {
          console.error(error)
        })
    }
  }
}
