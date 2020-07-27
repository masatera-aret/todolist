<template>
  <div class="account">
    <main class="account-box">
      <div class="account-parts-wrapp">
        <h2 class="text-center">Signin</h2>
        <div class="account-input-wrapp">
          <input v-model="email" @focus="inFocus" @blur="outFocus" type="email" />
          <span data-placeholder="Email"></span>
        </div>
        <div class="account-input-wrapp">
          <input v-model="password" @focus="inFocus" @blur="outFocus" type="password" />
          <span data-placeholder="password"></span>
        </div>
        <button class="login-btn" :class="inputCheck" @click="toSignin">signin</button>
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
// Login.vueに、同じ内容のstyleが適応されている。

</style>