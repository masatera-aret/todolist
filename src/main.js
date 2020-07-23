import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

// Initialize Firebase

// router.beforeEach((to, from, next) => {
//   console.log("to:", to)
//   console.log("from:", from)
//   next()
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
