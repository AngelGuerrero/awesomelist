import Vue from 'vue'
import App from './App.vue'
import { store } from './store'
import { firestorePlugin } from 'vuefire'

//
// Bootstrap
import {
  IconsPlugin,
<<<<<<< HEAD
  FormInputPlugin,
  ListGroupPlugin,
  LayoutPlugin,
  ButtonPlugin
=======
  ListGroupPlugin
>>>>>>> 40470bb4c92e89c0d3ede2942b47bf161c88546d
} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

<<<<<<< HEAD
//
// Vuesax
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'
=======
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'
// import 'material-icons/iconfont/material-icons.css'
>>>>>>> 40470bb4c92e89c0d3ede2942b47bf161c88546d

import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
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
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Form)
Vue.use(FormItem)

//
// Bootstrap
Vue.use(ListGroupPlugin)
Vue.use(IconsPlugin)
Vue.use(ListGroupPlugin)
Vue.use(LayoutPlugin)
Vue.use(ButtonPlugin)

<<<<<<< HEAD
//
// Vuesax
=======
>>>>>>> 40470bb4c92e89c0d3ede2942b47bf161c88546d
Vue.use(Vuesax)

//
// Firestore
Vue.use(firestorePlugin)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
