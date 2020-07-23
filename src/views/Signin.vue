<template>
  <div class="signin">
    <main class="signin-box">
      <div class="signin-input-wrap">
        <h2 class="text-center">Signin</h2>
        Email
        <input v-model="email" type="email" />
        password
        <input v-model="password" type="password" />
        <button @click="toSignin" class="signin-btn">signin</button>
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
      password: ""
    }
  },
  computed: {
    db() {
      return this.$store.state.db
    },
    firebase() {
      return this.$store.state.firebase
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
    }
  }
}
</script>

<style lang="scss" scoped>

.signin {
  width: 100%;
  min-height: 100vh;
  display:grid;
  grid-template:
  ".... .... ...."
  ".... main ...." 400px
  ".... .... ...."
  /auto 300px auto;
}

.signin-box {
  grid-area: main;
  padding: 20px;
  border: 1px solid rgb(108, 108, 108);

  .signin-input-wrap {
    display: flex;
    flex-direction: column;

    .signin-btn {
      margin-top: 20px;
    }
  }
}

</style>