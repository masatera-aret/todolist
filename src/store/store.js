import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import router from '../router/router'

Vue.use(Vuex)

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
firebase.initializeApp(firebaseConfig)


export default new Vuex.Store({
  state: {
    firebase: firebase,
    db: firebase.firestore(),
    userInfo: true,
    isLoading: true
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    setIsLoading(state, bool) {
      state.isLoading = bool
    }
  },
  actions: {
    isUserCheckFunc(context) {
      firebase.auth().onAuthStateChanged(user => {
        if(user) {
          context.commit("setUserInfo",user)
          router.push({name:"Main"});
        }else {
          console.log("user情報なし")
        }
      })
    }
  }
})