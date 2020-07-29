import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Signin from '../views/Signin.vue'
import Modal from '../views/Modal.vue'
import firebase from 'firebase/app'
import 'firebase/app'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter(to, from, next) {
      firebase.auth().onAuthStateChanged(user => {
        if(user) {
          next({name:"Main"})
        }else {
          next()
        }
      })
    }
  },
  {
    path: '/signin',
    name: 'Signin',
    component: Signin,
    beforeEnter(to, from, next) {
      firebase.auth().onAuthStateChanged(user => {
        if(user) {
          next({name:"Main"})
        }else {
          next()
        }
      })
    }
  },
  {
    path: '/main',
    name: 'Main',
    // route level code-splitting
    // this generates a separate chunk (main.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "main" */ '../views/Main.vue'),
    beforeEnter(to, from, next) {
      firebase.auth().onAuthStateChanged(user => {
        if(!user) {
          if(from.path == "/signin") {
            next({name:"Signin"})
          }else {
            next({name:"Login"})
          }
        }else {
          next()
        }
      })
    }
  },
  {
    path: '/modal',
    name: 'Modal',
    component: Modal,
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/*',
    redirect: '/'
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
