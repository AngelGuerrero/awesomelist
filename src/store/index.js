import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'

import todo from '@/store/modules/ToDo'
import ui from '@/store/modules/UI'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {},

  getters: {},

  mutations: {
    ...vuexfireMutations
  },

  actions: {},

  modules: {
    todo,
    ui
  }
})
