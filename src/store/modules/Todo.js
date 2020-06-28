import { db } from '@/data/FirebaseConfig'
import { firestoreAction } from 'vuexfire'

export default {
  namespaced: true,

  state: {
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

    saveTodo: async ({ commit }, payload) => {
      db.collection('todos')
        .add(payload)
        .then(response => {
          console.log(`Todo created successfully with id: ${response.id}`)
        }).catch(error => {
          console.log(`Something went wront ${error}`)
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
