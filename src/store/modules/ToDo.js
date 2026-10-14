import { db } from '@/data/FirebaseConfig'
import { firestoreAction } from 'vuexfire'
import List from '../../data/ListClass'
import {
  createCollectionList,
  filterToDosByList,
  normalizeCollectionId,
  getCurrentUserId,
  getOwnedCollection
} from '@/data/ToDoCollections'

function notifyError (commit, message) {
  commit('ui/showNotification', {
    show: true,
    color: 'danger',
    title: 'Algo salió mal',
    text: message
  }, { root: true })
}

export default {
  namespaced: true,

  state: () => ({
    //
    // All collection of To Do's
    todos: [],
    //
    // User-owned groups of tasks
    collections: [],
    collectionsLoading: false,
    collectionsError: null,
    collectionUserId: null,
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
    currentList: new List('default', 'Tareas', 'default', 'Todas las tareas', '#0078d7')
  }),

  getters: {
    getUncompletedToDos: (state) => {
      const todos = state.todos
        .filter(el => !el.done)
        .sort((a, b) => b.created - a.created)

      return filterToDosByList(todos, state.currentList)
    },

    getCompletedToDos: (state) => {
      if (!state.todos || !state.todos.length) return []

      const todos = state.todos
        .filter(el => el.done)
        .sort((a, b) => a.created - b.created)

      return filterToDosByList(todos, state.currentList)
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

    selectCollection (state, collection) {
      state.currentList = createCollectionList(collection)
    },

    syncCollectionTitle (state, { id, name }) {
      if (state.currentList.filter === 'collectionId' && state.currentList.collectionId === id) {
        state.currentList = createCollectionList({ id, name })
      }
    },

    setCollectionsLoading (state, value) {
      state.collectionsLoading = value
    },

    setCollectionsError (state, value) {
      state.collectionsError = value
    },

    setCollectionUserId (state, uid) {
      state.collectionUserId = uid
    },

    setCurrentList (state, payload) {
      state.currentList = payload
    }
  },

  actions: {
    getToDos: firestoreAction(({ bindFirestoreRef }, uid) => {
      return bindFirestoreRef('todos', db.collection('todos').where('createdBy', '==', uid))
    }),

    getCollections: firestoreAction(async ({ state, commit, bindFirestoreRef, unbindFirestoreRef }, uid) => {
      commit('setCollectionUserId', uid)
      commit('setCollections', [])
      commit('setCollectionsError', null)
      commit('setCollectionsLoading', !!uid)
      if (!uid) {
        unbindFirestoreRef('collections')
        return { error: false }
      }
      try {
        await bindFirestoreRef('collections', db.collection('collections').where('userId', '==', uid))
        return { error: false }
      } catch (error) {
        if (state.collectionUserId === uid) commit('setCollectionsError', error.message)
        return { error: true, message: error.message }
      } finally {
        if (state.collectionUserId === uid) commit('setCollectionsLoading', false)
      }
    }),

    createNewToDoCollection: async ({ commit, rootState }, { name }) => {
      const returnValue = { error: false, message: '', data: null }

      try {
        const userId = getCurrentUserId(rootState)
        const trimmedName = typeof name === 'string' ? name.trim() : ''
        if (!trimmedName || trimmedName.length > 200) throw new Error('El nombre debe tener entre 1 y 200 caracteres')
        const collection = { name: trimmedName, created: new Date(), lastUpdated: null, userId }
        const response = await db.collection('collections').add(collection)
        returnValue.message = 'Colección creada correctamente'
        returnValue.data = { ...collection, id: response.id }
        // Existing Vuexfire bindings receive the new collection automatically.
      } catch (error) {
        returnValue.error = true
        returnValue.message = error.message
        notifyError(commit, returnValue.message)
      }

      return returnValue
    },

    renameCollection: async ({ commit, rootState }, { id, name }) => {
      try {
        const uid = getCurrentUserId(rootState)
        const collectionId = normalizeCollectionId(id)
        if (!collectionId) throw new Error('La colección seleccionada no es válida')
        const trimmedName = typeof name === 'string' ? name.trim() : ''
        if (!trimmedName || trimmedName.length > 200) throw new Error('El nombre debe tener entre 1 y 200 caracteres')
        await db.runTransaction(async transaction => {
          await getOwnedCollection(transaction, db, collectionId, uid)
          transaction.update(db.collection('collections').doc(collectionId), { name: trimmedName, lastUpdated: new Date() })
        })
        commit('syncCollectionTitle', { id: collectionId, name: trimmedName })
        return { error: false }
      } catch (error) {
        notifyError(commit, error.message)
        return { error: true, message: error.message }
      }
    },

    saveToDo: async ({ commit, dispatch, rootState }, payload) => {
      const returnValue = { error: false, message: '', data: { ...payload } }

      try {
        const uid = getCurrentUserId(rootState)
        const collectionId = normalizeCollectionId(payload.collectionId)
        const title = typeof payload.title === 'string' ? payload.title.trim() : ''
        if (!title) throw new Error('Escribe un título para la tarea')
        const data = { ...payload, title, createdBy: uid, collectionId }
        delete data.id
        let response
        if (collectionId === null) {
          response = await db.collection('todos').add(data)
        } else {
          const reference = db.collection('todos').doc()
          await db.runTransaction(async transaction => {
            await getOwnedCollection(transaction, db, collectionId, uid)
            transaction.set(reference, data)
          })
          response = reference
        }
        returnValue.data = { ...data, id: response.id }
        returnValue.message = 'Tarea creada correctamente'

        commit('ui/showNotification', {
          show: true,
          color: 'success',
          title: returnValue.message,
          text: data.title
        }, { root: true })

        dispatch('ui/playAddTaskSound', true, { root: true })
      } catch (error) {
        returnValue.error = true
        returnValue.message = error.message
        notifyError(commit, returnValue.message)
      }

      return returnValue
    },

    updateToDoById: async ({ commit }, todo) => {
      const returnValue = { error: false, message: '' }

      // Membership changes use a transaction, never a stale detail snapshot.
      const { id, collectionId, ...data } = todo

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

    moveToDoToCollection: async ({ commit, rootState }, { id, collectionId }) => {
      const returnValue = { error: false, message: '', data: null }
      try {
        const uid = getCurrentUserId(rootState)
        const targetId = normalizeCollectionId(collectionId)
        if (typeof id !== 'string' || !id || id.includes('/')) throw new Error('La tarea no es válida')
        returnValue.data = await db.runTransaction(async transaction => {
          const reference = db.collection('todos').doc(id)
          const snapshot = await transaction.get(reference)
          if (!snapshot.exists || snapshot.data().createdBy !== uid) {
            throw new Error('La tarea no existe o no pertenece a tu cuenta')
          }
          if (targetId !== null) await getOwnedCollection(transaction, db, targetId, uid)
          transaction.update(reference, { collectionId: targetId, lastUpdated: new Date() })
          return { id, collectionId: targetId }
        })
        returnValue.message = targetId === null ? 'Tarea sin colección' : 'Tarea movida a la colección'
        commit('ui/showNotification', {
          show: true,
          border: 'success',
          title: returnValue.message
        }, { root: true })
      } catch (error) {
        returnValue.error = true
        returnValue.message = error.message
        notifyError(commit, returnValue.message)
      }
      return returnValue
    },

    deleteToDoById: async ({ commit }, id) => {
      const returnValue = { error: false, message: 'Tarea eliminada correctamente' }

      try {
        await db.collection('todos').doc(id).delete()
      } catch (error) {
        returnValue.error = true
        returnValue.message = error.message
        commit('ui/showNotification', {
          show: true,
          color: 'danger',
          title: 'Algo salió mal',
          text: returnValue.message
        }, { root: true })
      }

      return returnValue
    },

    //
    // EVENTS
    //
    onToggleToDo: async ({ dispatch, commit }, todo) => {
      const updated = { ...todo, id: todo.id, lastUpdated: new Date() }

      const responseDispatch = await dispatch('updateToDoById', updated)

      if (responseDispatch.error) return responseDispatch

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

      if (responseDispatch.error) return responseDispatch

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

      if (responseDispatch.error) return responseDispatch

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
