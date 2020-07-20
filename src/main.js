import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import firebase from 'firebase/app'
import 'firebase/app'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyA_11LX3CsIDPjHkSWNCurI6CIj4SaewvA",
  authDomain: "note-pad-fe946.firebaseapp.com",
  databaseURL: "https://note-pad-fe946.firebaseio.com",
  projectId: "note-pad-fe946",
  storageBucket: "note-pad-fe946.appspot.com",
  messagingSenderId: "167740246624",
  appId: "1:167740246624:web:3385c7a4a6a4af2f8c1105",
  measurementId: "G-RLCYKBXHFP"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
