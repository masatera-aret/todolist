<template>
  <div id="app">
    <VueLoading v-show="isLoading"></VueLoading>
    <!-- <keep-alive> -->
    <router-view v-show="!isLoading"></router-view>
    <!-- </keep-alive> -->
  </div>
</template>

<script>
import VueLoading from './views/VueLoading'
// import { mapGetters } from 'vuex'

export default {
  components: {
    VueLoading
  },
  computed:{
    isLoading() {
      return this.$store.getters.isLoading
    }
  },
  watch: {
    $route(to) {
      this.createPageTitle(to)
    }
  },
  methods: {
    createPageTitle(to) {
      if(to.meta.title) {
        document.title = to.meta.title
      }else {
        document.title = "テストです"
      }
    }
  },
  mounted() {
    let to = this.$route
    this.createPageTitle(to)
    this.$store.commit("setIsLoading", false)
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
