import Vue from 'vue'
import App from './App.vue'
import { store } from './store'
import { firestorePlugin } from 'vuefire'

//
// Bootstrap
import {
  IconsPlugin,
  FormInputPlugin,
  ListGroupPlugin,
  LayoutPlugin,
  ButtonPlugin,
  SpinnerPlugin,
  CalendarPlugin,
  CollapsePlugin
} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

//
// Vuesax
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'

import {
  Dropdown,
  DropdownMenu,
  DropdownItem
} from 'element-ui'

Vue.config.productionTip = false

//
// Element UI
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)

//
// Bootstrap
Vue.use(ListGroupPlugin)
Vue.use(FormInputPlugin)
Vue.use(IconsPlugin)
Vue.use(ListGroupPlugin)
Vue.use(LayoutPlugin)
Vue.use(ButtonPlugin)
Vue.use(SpinnerPlugin)
Vue.use(CalendarPlugin)
Vue.use(CollapsePlugin)

//
// Vuesax
Vue.use(Vuesax)

//
// Firestore
Vue.use(firestorePlugin)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
