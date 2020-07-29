<template>
  <div class="auth">
    <main class="auth_container">
      <div class="auth_wrapper">
        <h2 class="text-center">Login</h2>
        <div class="auth_inner">
          <input v-model="email" :class="isEmail" @focus="inFocus" @blur="outFocus" type="email" />
          <span data-placeholder="Email"></span>
        </div>
        <div class="auth_inner">
          <input v-model="password" :class="isPass" @focus="inFocus" @blur="outFocus" type="password" />
          <span data-placeholder="password"></span>
        </div>
        <button class="auth_send_btn" :class="inputCheck" @click="toLogin">login</button>
        <!-- <button @click="toLoginByGoogle">googleでログインだ！</button> -->
        <button class="login_btn_by_google" @click="toLoginByGoogle">
          <img src="https://img.icons8.com/color/48/000000/google-logo.png"/>
          <span>Login with Google</span>
        </button>
      </div>
      <router-link :to="{name: 'Signin'}">signin</router-link>
    </main>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      email: "terakado@terakado.jp",
      password: "terakado",
      emailRegexp:/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/,
    }
  },
  computed: {
    firebase() {
      return this.$store.getters.firebase
    },
    providerGoogle() {
      return this.$store.state.providerGoogle
    },
    inputCheck() {
      if(this.emailRegexp.test(this.email) && this.password.length >= 6) {
        return {btnClickPermission: true}
      }else {
        return {btnClickPermission: false}
      }
    },
    isEmail() {
      if(this.email != "") {
        return {inFocus: true, outFocus: true}
      }else {
        return {inFocus: true, outFocus: false}
      }
    },
    isPass() {
      if(this.password != "") {
        return {inFocus: true, outFocus: true}
      }else {
        return {inFocus: true, outFocus: false}
      }
    }
  },
  methods: {
    async toLogin() {
      this.$store.commit("setIsLoading", true)
      await this.firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .catch((err) => console.log("ログインエラー:",err))
      this.email = ""
      this.password = ""
    },
    async toLoginByGoogle() {
      await this.firebase.auth().signInWithPopup(this.providerGoogle)
      .catch(err => console.log("googleログインでエラー:",err))
    },
    inFocus(ev) {
      ev.target.classList.add("inFocus")
    },
    outFocus(ev) {
      if(ev.target.value == "") {
        ev.target.classList.remove("inFocus")
        ev.target.classList.remove("outFocus")
      }else {
        ev.target.classList.add("outFocus")
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/account_auth';

</style>