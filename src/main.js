import Vue from 'vue'
import App from './App.vue'
import { store } from './store'
import router from './router'
import VueFormulate from '@braid/vue-formulate'
import { firestorePlugin } from 'vuefire'
import { firebase } from '@firebase/app'

//
// Bootstrap
import {
  IconsPlugin,
  FormInputPlugin,
  FormPlugin,
  ListGroupPlugin,
  LayoutPlugin,
  ButtonPlugin,
  SpinnerPlugin,
  CalendarPlugin,
  CollapsePlugin,
  AlertPlugin
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
Vue.use(FormPlugin)
Vue.use(IconsPlugin)
Vue.use(ListGroupPlugin)
Vue.use(LayoutPlugin)
Vue.use(ButtonPlugin)
Vue.use(SpinnerPlugin)
Vue.use(CalendarPlugin)
Vue.use(CollapsePlugin)
Vue.use(AlertPlugin)

//
// Vuesax
Vue.use(Vuesax)

//
// Firestore
Vue.use(firestorePlugin)

//
// Vue formulate
Vue.use(VueFormulate, {
  classes: {
    input: [
      'form-control',
      'form-control-sm',
      'mb-1 p-1'
    ],
    label: 'mt-2',
    errors: [
      'errors-class'
    ]
  }
})

//
// Listen firebase authentication change
let app

firebase.auth().onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      devtool: 'source-map',
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
