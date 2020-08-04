<template>
  <div class="auth">
    <main class="auth_container">
      <div class="auth_wrapper">
        <h2 class="text-center">Login</h2>
        <div class="auth_inner">
          <input v-model="email" :class="emailStatus" @focus="inFocus" @blur="outFocus" type="email" />
          <span data-placeholder="Email"></span>
        </div>
        <div class="auth_inner">
          <input v-model="password" :class="passwordStatus" @focus="inFocus" @blur="outFocus" type="password" />
          <span data-placeholder="password"></span>
        </div>
        <button class="auth_send_btn" :tabindex="tabindex" :class="inputCheck" @click="toLogin">login</button>
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
      email: "",
      password: "",
      emailStatus: { in_focus: false, out_focus: false },
      passwordStatus: { in_focus: false, out_focus: false },
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
        return {btn_click_permission: true}
      }else {
        return {btn_click_permission: false}
      }
    },
    tabindex() {
      if(this.emailRegexp.test(this.email) && this.password.length >= 6) {
        return "0"
      }else {
        return "-1"
      }
    }
  },
  watch: {
    email: function () {
      if (this.emailRegexp.test(this.email)) {
        this.emailStatus.in_focus = true
        this.emailStatus.out_focus = true
      } else {
        this.emailStatus.in_focus = true
        this.emailStatus.out_focus = false
      }
    },
    password: function () {
      if (this.password.length >= 6 && this.password.length <= 20) {
        this.passwordStatus.in_focus = true
        this.passwordStatus.out_focus = true
      }else {
        this.passwordStatus.in_focus = true
        this.passwordStatus.out_focus = false
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
      ev.target.classList.add("in_focus");
    },

    outFocus(ev) {
      const el = ev.target;
      if (el.value == "") {
        el.classList.remove("in_focus");
      }
    },
  },
  created() {
    this.email = "terakado@terakado.jp"
    this.password = "terakado"
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/account_auth';

</style>