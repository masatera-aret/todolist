<template>
  <div class="signin">
    <main class="signin-box">
      <div class="signin-input-wrap">
        userID
        <input type="text" />
        password
        <input type="text" />
        <button class="signin-btn">signin</button>
      </div>
      <router-link :to="{name: 'Login'}">Login</router-link>
    </main>
  </div>
</template>

<script>
export default {
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