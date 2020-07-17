import { db } from '@/data/FirebaseConfig'
import { firestoreAction } from 'vuexfire'
import List from '../../data/ListClass'

export default {
  namespaced: true,

  state: {
    //
    // All collection of To Do's
    todos: [],
    //
    // Gruped To Do's lists
    collections: [],
    //
    // Grup of To Do's
    lists: [],
    //
    // Instances of list for categories
    categories: {
      DEFAULT: new List('default', 'Tareas', 'default', 'Todas las tareas', '#0078d7'),
      MYDAY: new List('myday', 'Mi día', 'isOnMyDay', 'Mis tareas para hoy', '#e36572'),
      IMPORTANT: new List('important', 'Importante', 'isImportant', 'Tareas importantes', '#c99a0e')
    },
    //
    // The list is showed currently,
    // this object contains the options
    // of filtered To Do's
    currentList: null
  },

  getters: {
    getUncompletedToDos: (state) => {
      const todos = state.todos
        .filter(el => !el.done)
        .sort((a, b) => b.created - a.created)

      if (state.currentList.filter === 'default') return todos

      const filtered = todos.filter(el => el[state.currentList.filter])

      return filtered
    },

    getCompletedToDos: (state) => {
      const todos = state.todos
        .filter(el => el.done)
        .sort((a, b) => a.created - b.created)

      if (state.currentList.filter === 'default') return todos

      const filtered = todos.filter(el => el[state.currentList.filter])

      return filtered
    },

    getListsOfCollection: (state) => (collectionId) =>
      state.lists
        .filter(li => li.collectionId === collectionId),

    thereAreLists: (state) =>
      state.lists.length > 0,

    collectionHasLists: (state) => (collectionId) => {
      const collection = state.collections.find(el => el.id === collectionId)

      return ('lists' in collection)
    },

    getCurrentList: state => state.currentList
  },

  mutations: {
    setCollections (state, payload) {
      state.collections = payload
    },

    setListToCollection (state, { collectionId, lists }) {
      let copyCollections = Array.from(state.collections)

      const collection = copyCollections.find(el => el.id === collectionId)
      Object.assign(collection, { lists })

      state.collections = copyCollections
    },

    setLists (state, payload) {
      state.lists = payload
    },

    setCurrentList (state, payload) {
      state.currentList = payload
    },

    addCurrentListFilter (state, payload) {
      state.currentList.filterBy.push(payload)
    }
  },

  actions: {
    getToDos: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('todos', db.collection('todos'))
    }),

    getCollections: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('collections', db.collection('collections'))
    }),

    getListsFromCollection: async ({ state, commit }, collectionId) => {
      const retval = { error: false, message: 'ok', data: [] }

      const query = await db
        .collection('collections')
        .doc(collectionId)
        .collection('lists')

      try {
        const response = await query.get()

        response.forEach((record) => {
          retval.data.push({
            id: record.id,
            collectionId,
            ...record.data()
          })
        })

        commit('setLists', retval.data)
        commit('setListToCollection', { collectionId, lists: retval.data })
      } catch (error) {
        retval.error = true
        retval.message = error.message
      }

      return retval
    },

    createNewToDoCollection: async ({ dispatch }, { name, userId }) => {
      const collection = {
        name,
        created: new Date(),
        lastUpdated: null,
        userId: userId
      }

      db.collection('collections')
        .add(collection)
        .then(_ => {
          console.log('Colección creada correctamente!')
          dispatch('getCollections')
        })
        .catch(error => {
          console.log(`Ocurrió un error al crear la colección: ${error}`)
        })
    },

    saveToDo: async ({ context }, payload) => {
      db.collection('todos')
        .add(payload)
        .then((response) => {
          console.log(`ToDo created successfully with id: ${response.id}`)
        })
        .catch((error) => {
          console.log(`Something went wront ${error}`)
        })
    },

    getToDoById: async ({ context }, id) => {
      db.collection('todos')
        .doc(id)
        .get()
        .then((response) => {
          console.log(response)
          // commit('setToDo', response)
        })
        .catch((error) => {
          console.log(`Error getting todo: ${error}`)
        })
    },

    updateToDoById: async ({ context }, todo) => {
      db.collection('todos')
        .doc(todo.id)
        .update(todo)
        .then((_) => console.log('ToDo updated successfully'))
        .catch((error) => console.log(`Something went wrong: ${error}`))
    },

    deleteToDoById: async ({ context }, id) => {
      db.collection('todos')
        .doc(id)
        .delete()
        .then(() => console.log('ToDo deleted successfully'))
        .catch((error) => console.error(`Something went wrong: ${error}`))
    }
  }
}
