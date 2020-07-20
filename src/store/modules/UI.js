export default {
  namespaced: true,

  state: {
    notification: {
      show: false,
      title: '',
      text: '',
      position: 'top-left'
    },

    // TODO: Add a queue to play all sound from completed tasks
    doneTaskSound: false,
    addTaskSound: false

  },

  getters: {
  },

  mutations: {
    showNotification (state, payload) {
      // !
      // ! Default settings
      // !
      payload.square = true
      payload.position = 'bottom-left'

      state.notification = payload
    },

    playDoneTaskSound (state, value) {
      state.doneTaskSound = value
    }
  },

  actions: {
    playAddTaskSound: ({ state }, value) => {
      state.addTaskSound = value

      const restore = () => { state.addTaskSound = false }

      setTimeout(_ => restore(), 100)
    }
  }
}
