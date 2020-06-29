import Vue from 'vue'
import App from './App.vue'
import { store } from './store'
import { firestorePlugin } from 'vuefire'

import {
  IconsPlugin,
  ListGroupPlugin
} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'
// import 'material-icons/iconfont/material-icons.css'

import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  Checkbox,
  Collapse,
  CollapseItem,
  Form,
  FormItem
} from 'element-ui'

Vue.config.productionTip = false

//
// Element UI
Vue.use(Button)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Form)
Vue.use(FormItem)

//
// Bootstrap
Vue.use(ListGroupPlugin)
Vue.use(IconsPlugin)

Vue.use(Vuesax)

//
// Firestore
Vue.use(firestorePlugin)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
