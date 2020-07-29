<template>
  <div class="auth">
    <main class="auth_container">
      <div class="auth_wrapper">
        <h2 class="text-center">Signin</h2>
        <div class="auth_inner">
          <input v-model="email" @focus="inFocus" @blur="outFocus" type="email" />
          <span data-placeholder="Email"></span>
        </div>
        <div class="auth_inner">
          <input v-model="password" @focus="inFocus" @blur="outFocus" type="password" />
          <span data-placeholder="password"></span>
        </div>
        <button class="auth_send_btn" :class="inputCheck" @click="toSignin">signin</button>
      </div>
      <router-link :to="{name: 'Login'}">Login</router-link>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      emailRegexp:/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/,
    }
  },
  computed: {
    db() {
      return this.$store.state.db
    },
    firebase() {
      return this.$store.state.firebase
    },
    inputCheck() {
      if(this.emailRegexp.test(this.email) && this.password.length >= 6) {
        return {btnClickPermission: true}
      }else {
        return {btnClickPermission: false}
      }
    }
  },
  methods: {
    toSignin() {
      this.firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
      .then(() => {
        this.$router.push({name:"Main"})
      })
      .catch(err => {
        console.log("SignIn firebase Error:",err)
      })
      this.email = ""
      this.password = ""
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
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/account_auth';

</style>