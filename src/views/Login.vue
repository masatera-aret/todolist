<template>
  <div class="login">
    <main class="login-box">
      <div class="login-input-wrap">
        <h2 class="text-center">Login</h2>
        Email
        <input v-model="email" type="email" />
        password
        <input v-model="password" type="password" />
        <button @click="toLogin" class="login-btn">login</button>
      </div>
      <router-link :to="{name: 'Signin'}">signin</router-link>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: ""
    }
  },
  computed: {
    firebase() {
      return this.$store.state.firebase
    }
  },
  methods: {
    toLogin() {
      this.firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .then(() => {
        this.$router.push({name:"Main"})
      })
      .catch(err => {
        console.log("has error from to do Login:", err)
      })
      this.email = ""
      this.password = ""
    }
  }
}
</script>

<style lang="scss" scoped>

.login {
  width: 100%;
  min-height: 100vh;
  display:grid;
  grid-template:
  ".... .... ...."
  ".... main ...." 450px
  ".... .... ...."
  /auto 350px auto;
}

.login-box {
  grid-area: main;
  padding: 20px;
  border: 1px solid rgb(108, 108, 108);

  .login-input-wrap {
    display: flex;
    flex-direction: column;

    .login-btn {
      margin-top: 20px;
    }
  }
}

</style>