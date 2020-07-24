<template>
  <div id="app" class="container">
    <VueLoading v-show="this.$store.state.isLoading"></VueLoading>
    <router-view v-show="!this.$store.state.isLoading"></router-view>
  </div>
</template>

<script>
import VueLoading from './views/VueLoading'
import { mapGetters } from 'vuex'

export default {
  components: {
    VueLoading
  },
  computed:{
    ...mapGetters(["isLoading"])
  },
  mounted() {
    this.$store.commit("setIsLoading",false)
  }
}
</script>

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
