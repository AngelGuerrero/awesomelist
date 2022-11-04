import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'
import { firebase } from '@/data/FirebaseConfig'

import todo from '@/store/modules/ToDo'
import user from '@/store/modules/User'
import ui from '@/store/modules/UI'

Vue.use(Vuex)

//
// Handle reload window
firebase.auth().onAuthStateChanged(async user => {
  if (!user) return

  //
  // Add tasks to the queue to resolve later when load main App component
  //
  // Set the current user in state
  store.commit('user/setCurrentUser', user)

  //
  // Get the user profile from firebase authentication
  await store.dispatch('user/fetchUserProfile', user.uid)

  // store.commit('addTaskToQueue', {
  //   action: 'users/setCurrentUser',
  //   data: user,
  //   label: 'Validando sesión de usuario'
  // })
  //
  // Fetch user from the database
  // store.commit('addTaskToQueue', {
  //   action: 'users/fetchUserProfile',
  //   data: user.uid,
  //   label: 'Obteniendo perfil'
  // })
})

export const store = new Vuex.Store({
  state: {},

  getters: {},

  mutations: {
    ...vuexfireMutations
  },

  actions: {
    getDataByQuery: async ({ context }, query) => {
      const returnValue = { error: false, message: 'ok', data: null }

      try {
        const list = []
        const dataRef = await query.get()
        const snapshot = await dataRef
        const documents = await snapshot

        documents.forEach(snapshot => list.push(snapshot.data()))

        returnValue.data = list
      } catch (error) {
        returnValue.error = true
        returnValue.message = 'Error getting data'
      }

      return returnValue
    }
  },

  modules: {
    todo,
    user,
    ui
  }
})
