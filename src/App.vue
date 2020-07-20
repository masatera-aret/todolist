<template>
  <div id="app" class="container">
    <div class="login-box">
      <div class="login-input-wrap">
        userID
        <input type="text" />
        password
        <input type="text" />
        <button class="login-btn">login</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

#app {
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

<style lang="scss">
#app {
  min-height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
