import Vue from 'vue'
import App from './App.vue'
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

new Vue({
  render: h => h(App)
}).$mount('#app')
