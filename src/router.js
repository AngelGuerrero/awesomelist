import Vue from 'vue'
import VueRouter from 'vue-router'
import Access from './components/Views/Access/Access'
import Dashboard from './components/Views/Dashboard'
import { firebase } from '@/data/FirebaseConfig'

Vue.use(VueRouter)

const routes = [
  { path: '', redirect: 'login' },
  { path: '*', redirect: 'login' },
  { path: '/', redirect: 'login' },
  //
  // Access
  {
    path: '/login',
    name: 'login',
    component: Access,
    props: { view: 'login' }
  },
  //
  // Dashboard
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(route => route.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('dashboard')
  else next()
})

export default router
