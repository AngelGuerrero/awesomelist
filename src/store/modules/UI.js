export default {
  namespaced: true,

  state: {
    /**
     * Last registered window width
     */
    window: {
      lastWidhtSize: null
    },

    /**
     * To Do Menu Component's settings
     */
    toDoMenu: {
      isFixed: false
    },

    /**
     * Sidebar Component' settings
     */
    sidebar: {
      mobile: false
    },

    /**
    * Object that is watched and
    * send user notification
    */
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
    isResizeToRight: (state) => state.window.lastWidhtSize < window.innerWidth
  },

  mutations: {
    computeSizeComponents (state) {
      // Menu
      if (state.toDoMenu.isFixed) {
        state.toDoMenu.isFixed = window.innerWidth > 850
      }

      // Sidebar
      state.sidebar.mobile = window.innerWidth < 900
    },

    toggleToDoMenuFixed (state, value) {
      state.toDoMenu.isFixed = value
    },

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
    listenWindowResize: ({ state, getters, commit }) => {
      state.window.lastWidhtSize = window.innerWidth

      commit('computeSizeComponents')

      window.addEventListener('resize', () => {
        commit('computeSizeComponents')

        if (getters('isResizeToRight')) {
          console.log('Se está moviendo hacia la derecha')
        } else {
          console.log('Se está moviendo hacia la izquierda')
        }
      })
    },

    playAddTaskSound: ({ state }, value) => {
      state.addTaskSound = value

      const restore = () => { state.addTaskSound = false }

      setTimeout(_ => restore(), 100)
    }
  }
}
