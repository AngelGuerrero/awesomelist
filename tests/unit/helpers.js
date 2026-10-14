import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'

export function createTestStore (todoOptions = {}) {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  const store = new Vuex.Store({
    modules: {
      todo: {
        namespaced: true,
        state: { collections: [], todos: [], categories: { DEFAULT: { name: 'default', filter: 'default' } } },
        mutations: { selectCollection: jest.fn() },
        getters: { getCurrentList: () => ({ name: 'default', filter: 'default' }) },
        ...todoOptions
      },
      user: { namespaced: true, state: { currentUser: { uid: 'user-1' } } },
      ui: {
        namespaced: true,
        state: { toDoMenu: { isFixed: false }, selectedComponent: { name: null, props: {} } },
        mutations: {
          toggleToDoMenuFixed: jest.fn(),
          setSelectedComponent: jest.fn((state, component) => { state.selectedComponent = component })
        }
      }
    }
  })
  return { localVue, store }
}

export function deferred () {
  const pending = {}
  const promise = new Promise((resolve, reject) => {
    pending.resolve = resolve
    pending.reject = reject
  })
  return { promise, ...pending }
}
