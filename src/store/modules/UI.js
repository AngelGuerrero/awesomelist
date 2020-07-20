export default {
  namespaced: true,

  state: {
    notification: {
      show: false,
      title: '',
      text: '',
      position: 'top-left'
    }
  },

  getters: {
  },

  mutations: {
    showNotification (state, payload) {
      //
      // Default settings
      //
      payload.square = true
      payload.position = 'bottom-left'

      state.notification = payload
    }
  },

  actions: {
  }
}
