import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'

import todo from '@/store/modules/ToDo'
import user from '@/store/modules/User'
import ui from '@/store/modules/UI'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {},

  getters: {},

  mutations: {
    ...vuexfireMutations
  },

  actions: {
    getDataByQuery: async (_ctx, query) => {
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
