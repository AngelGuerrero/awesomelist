export default {
  namespaced: true,

  state: {
    /**
     * Last registered window width
     */
    window: {
      lastWidhtSize: 0
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
     * Contains the information of selected component
     * selected from the user navigation menu
     */
    selectedComponent: {
      name: null,
      props: {}
    },

    /**
     * TODO: FIX BEHAVIOR BETWEEN COMPONENTS
     * Show the user profile menu
     * that contains links to other sections
     */
    showUserProfileMenu: false,

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
    isWindowGrowing: (state) => state.window.lastWidhtSize < window.innerWidth
  },

  mutations: {
    toggleUserProfileMenu: (state) => { state.showUserProfileMenu = !state.showUserProfileMenu },

    computeSizeComponents (state) {
      //
      // Sidebar
      state.sidebar.mobile = window.innerWidth <= 900
      //
      // Save size of window
      state.window.lastWidhtSize = window.innerWidth
    },

    checkToDoMenuSize (state, { getters }) {
      const breakpoint = 850

      if (getters.isWindowGrowing && !state.toDoMenu.isFixed) {
        state.toDoMenu.isFixed = window.innerWidth > breakpoint
      } else {
        if (!state.toDoMenu.isFixed) return
        state.toDoMenu.isFixed = window.innerWidth > breakpoint
      }
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
    },

    setSelectedComponent (state, { name, props }) {
      state.selectedComponent.name = name
      state.selectedComponent.props = props
    }
  },

  actions: {
    listenWindowResize: ({ state, getters, commit }) => {
      commit('computeSizeComponents', { getters })

      window.addEventListener('resize', () => {
        commit('checkToDoMenuSize', { getters })
        commit('computeSizeComponents')
      })
    },

    playAddTaskSound: ({ state }, value) => {
      state.addTaskSound = value

      const restore = () => { state.addTaskSound = false }

      setTimeout(_ => restore(), 100)
    }
  }
}
