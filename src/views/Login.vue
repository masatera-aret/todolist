<template>
  <div class="login">
    <main class="login-box">
      <div class="login-input-wrap">
        userID
        <input type="text" />
        password
        <input type="text" />
        <button class="login-btn">login</button>
      </div>
      <router-link :to="{name: 'Signin'}">signin</router-link>
    </main>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>

.login {
  width: 100%;
  min-height: 100vh;
  display:grid;
  grid-template:
  ".... .... ...."
  ".... main ...." 400px
  ".... .... ...."
  /auto 300px auto;
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