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
    // Grouped To Do's lists
    collections: [],
    //
    // Group of To Do's
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
    currentList: 'default'
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
      if (!state.todos || !state.todos.length) return []

      const todos = state.todos
        .filter(el => el.done)
        .sort((a, b) => a.created - b.created)

      if (state.currentList.filter === 'default') return todos

      const filtered = todos.filter(el => el[state.currentList.filter])

      return filtered
    },

    thereAreCompletedToDos: (state, getters) => {
      return getters.getCompletedToDos.length > 0
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
    }
  },

  actions: {
    getToDos: firestoreAction(({ bindFirestoreRef }, uid) => {
      return bindFirestoreRef('todos', db.collection('todos').where('createdBy', '==', uid))
    }),

    getCollections: firestoreAction(({ bindFirestoreRef }, uid) => {
      return bindFirestoreRef('collections', db.collection('collections').where('userId', '==', uid))
    }),

    getListsFromCollection: async ({ state, commit }, collectionId) => {
      const returnValue = { error: false, message: 'ok', data: [] }

      const query = await db
        .collection('collections')
        .doc(collectionId)
        .collection('lists')

      try {
        const response = await query.get()

        response.forEach((record) => {
          returnValue.data.push({
            id: record.id,
            collectionId,
            ...record.data()
          })
        })

        commit('setLists', returnValue.data)
        commit('setListToCollection', { collectionId, lists: returnValue.data })
      } catch (error) {
        returnValue.error = true
        returnValue.message = error.message
      }

      return returnValue
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
          dispatch('getCollections', userId)
        })
        .catch(error => {
          console.log(`Ocurrió un error al crear la colección: ${error}`)
        })
    },

    saveToDo: async ({ commit, dispatch }, payload) => {
      const returnValue = { error: false, message: '', data: payload }

      await db.collection('todos')
        .add(payload)
        .then(response => {
          returnValue.message = 'Tarea creada correctamente'
          returnValue.data.id = response.id

          commit('ui/showNotification', {
            show: true,
            color: 'success',
            title: returnValue.message,
            text: payload.title
          }, { root: true })

          dispatch('ui/playAddTaskSound', true, { root: true })
        })
        .catch(error => {
          returnValue.error = true
          returnValue.message = `Something went wrong ${error.message}`

          commit('ui/showNotification', {
            show: true,
            color: 'danger',
            title: 'Algo salió mal',
            text: returnValue.message
          }, { root: true })
        })

      return returnValue
    },

    updateToDoById: async ({ commit }, todo) => {
      const returnValue = { error: false, message: '' }

      const { id, ...data } = todo

      await db.collection('todos')
        .doc(id)
        .update(data)
        .then(_ => { returnValue.message = `To Do '${todo.title}' updated successfully` })
        .catch(error => {
          returnValue.error = true
          returnValue.message = error.message
          commit('ui/showNotification', {
            show: true,
            color: 'danger',
            title: 'Algo salió mal',
            text: returnValue.message,
            position: 'top-center'
          }, { root: true })
        })

      return returnValue
    },

    deleteToDoById: async (_ctx, id) => {
      db.collection('todos')
        .doc(id)
        .delete()
        .then(() => console.log('ToDo deleted successfully'))
        .catch((error) => console.error(`Something went wrong: ${error}`))
    },

    //
    // EVENTS
    //
    onToggleToDo: async ({ dispatch, commit }, todo) => {
      const updated = { ...todo, id: todo.id, lastUpdated: new Date() }

      const responseDispatch = await dispatch('updateToDoById', updated)

      commit('ui/showNotification', {
        show: true,
        progress: 'auto',
        border: 'success',
        title: updated.done ? 'Tarea completada' : 'Tarea desmarcada',
        text: updated.title
      }, { root: true })

      commit('ui/playDoneTaskSound', true, { root: true })

      return responseDispatch
    },

    onToggleAddToMyDay: async ({ dispatch, commit }, { todo, value }) => {
      const updated = { ...todo, id: todo.id, isOnMyDay: value }

      const responseDispatch = await dispatch('updateToDoById', updated)

      commit('ui/showNotification', {
        show: true,
        progress: 'auto',
        border: 'success',
        title: value ? 'Tarea agregada a tu día' : 'Tarea removida de tu día',
        text: todo.title
      }, { root: true })

      return responseDispatch
    },

    onToggleMarkAsImportant: async ({ dispatch, commit }, { todo, value }) => {
      const updated = { ...todo, id: todo.id, isImportant: value }

      const responseDispatch = await dispatch('updateToDoById', updated)

      commit('ui/showNotification', {
        show: true,
        progress: 'auto',
        border: 'success',
        title: value ? 'Tarea marcada como importante' : 'Tarea desmarcada como importante',
        text: todo.title
      }, { root: true })

      return responseDispatch
    }
  }
}
