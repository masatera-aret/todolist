<template>
  <div class="register">
    <div class="register-box">
      <div class="register-input-wrap">
        userID
        <input type="text" />
        password
        <input type="text" />
        <button class="register-btn">signin</button>
      </div>
      <router-link :to="{name: 'Login'}">Login</router-link>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toRegister() {
      this.$router.push({name: 'Register'})
    }
  }
}
</script>

<style lang="scss" scoped>

.register {
  min-height: 100vh;
  display:flex;
  align-items: center;
}

.register-box {
  width: 300px;
  height: 400px;
  padding: 20px;
  margin:auto;
  border: 1px solid rgb(108, 108, 108);

  .register-input-wrap {
    display: flex;
    flex-direction: column;

    .register-btn {
      margin-top: 20px;
    }
  }
}

</style>