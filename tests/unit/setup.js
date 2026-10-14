import Vue from 'vue'

Vue.config.productionTip = false
Vue.config.devtools = false

jest.mock('vuexfire', () => ({
  firestoreAction: action => action,
  vuexfireMutations: {}
}))

// Fail any unexpected HTTP request rather than contacting a real service.
global.fetch = jest.fn(() => {
  throw new Error('Las pruebas unitarias no deben acceder a la red')
})
XMLHttpRequest.prototype.open = jest.fn(() => {
  throw new Error('Las pruebas unitarias no deben acceder a la red')
})

HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue(undefined)
HTMLMediaElement.prototype.pause = jest.fn()
