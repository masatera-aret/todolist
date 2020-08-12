<template>
  <div class="auth">
    <main class="auth_container">
      <div class="auth_wrapper">
        <h2 class="text-center">Signin</h2>
        <div class="auth_inner">
          <input
            v-model="email"
            :class="emailStatus"
            @focus="inFocus"
            @blur="outFocus"
            type="email"
          />
          <span data-placeholder="Email"></span>
        </div>
        <div class="auth_inner">
          <input
            v-model="password"
            :class="passwordStatus"
            @focus="inFocus"
            @blur="outFocus"
            type="password"
          />
          <span data-placeholder="password"></span>
        </div>
        <button
          class="auth_send_btn"
          :tabindex="tabindex"
          :class="inputRuleJudging"
          @click="toSignin"
        >signin</button>
      </div>
      <router-link :to="{name: 'Login'}">Login</router-link>
    </main>
  </div>
</template>

<script>
import {LoginSigninMixin} from './LoginSigninMIxin'

export default {
  mixins:[LoginSigninMixin],
  computed: {
    db() {
      return this.$store.state.db;
    }
  },
  methods: {
    async setAuthData() {
      const user = await this.firebase.auth().currentUser
      if(user) {
        this.db.collection("users").doc(user.uid).set({
          text_id: 0,
          uid: user.uid,
          email: user.email,
          created_at: this.firebase.firestore.FieldValue.serverTimestamp()
        })
      }
    },

    async toSignin() {
      this.$store.commit("setIsLoading", true);
      await this.firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .catch((err) => console.log("SignIn firebase Error:", err))
      this.setAuthData()
      this.email = "";
      this.password = "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/account_auth";
</style>