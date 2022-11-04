import Vue from 'vue'
import Router from 'vue-router'
import { firebase } from '@firebase/app'

import Access from '@/Views/Access/Access'
import Dashboard from '@/Views/Dashboard'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Access,
      meta: { requiresAuth: false },
      props: { view: 'login' }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Access,
      meta: { requiresAuth: false },
      props: { view: 'signup' }
    },
    {
      path: '/restore-password',
      name: 'restorePassword',
      component: Access,
      meta: { requiresAuth: false },
      props: { view: 'restorePassword' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(route => route.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('dashboard')
  else next()
})

export default router
