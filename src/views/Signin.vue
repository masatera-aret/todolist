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
          :class="inputCheck"
          @click="toSignin"
        >signin</button>
      </div>
      <router-link :to="{name: 'Login'}">Login</router-link>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      emailStatus: { in_focus: false, out_focus: false },
      passwordStatus: { in_focus: false, out_focus: false },
      email: "",
      password: "",
      emailRegexp: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/,
    };
  },
  computed: {
    db() {
      return this.$store.state.db;
    },
    firebase() {
      return this.$store.state.firebase;
    },
    inputCheck() {
      if (this.emailRegexp.test(this.email) && this.password.length >= 6) {
        return { btn_click_permission: true };
      } else {
        return { btn_click_permission: false };
      }
    },
    tabindex() {
      if (this.emailRegexp.test(this.email) && this.password.length >= 6) {
        return "0";
      } else {
        return "-1";
      }
    },
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
    async toSignin() {
      this.$store.commit("setIsLoading", true);
      await this.firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .catch((err) => {
          console.log("SignIn firebase Error:", err);
        });
      this.email = "";
      this.password = "";
    },
    inFocus(ev) {
      ev.target.classList.add("in_focus");
    },

    outFocus(ev) {
      const el = ev.target;
      if (el.value == "") {
        el.classList.remove("in_focus");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/account_auth";
</style>