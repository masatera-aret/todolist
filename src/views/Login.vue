<template>
  <div class="login">
    <div class="login-box">
      <div class="login-input-wrap">
        userID
        <input type="text" />
        password
        <input type="text" />
        <button class="login-btn">login</button>
      </div>
      <router-link :to="{name: 'Register'}">signin</router-link>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>

.login {
  min-height: 100vh;
  display:flex;
  align-items: center;
}

.login-box {
  width: 300px;
  height: 400px;
  padding: 20px;
  margin:auto;
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