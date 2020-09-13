<template>
<v-app>
    <VueLoading v-show="isLoading"></VueLoading>
  <!-- <keep-alive> -->
    <router-view v-show="!isLoading"></router-view>
  <!-- </keep-alive> -->
</v-app>
</template>

<script>
import VueLoading from './views/VueLoading'
import { mapGetters, mapMutations } from 'vuex'
import { User } from './models/model'

export default {
  components: {
    VueLoading
  },
  computed:{
    ...mapGetters(["firebase", "isLoading", "userInfo", "test", "userClass"]),
  },
  watch: {
    $route(to) {
      this.createPageTitle(to)
    }
  },
  methods: {
    ...mapMutations(["setUserInfo", "setIsLoading", "setUserClass"]),
    hasAuth() {
      this.firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // this.setUserInfo(user)
          this.setUserClass(new User(user))
          console.log(this.userClass)
        } else {
          this.setIsLoading(false)
          this.setUserClass(null)
          console.log(this.userClass)
        }
      });
    },
    createPageTitle(to) {
      if(to.meta.title) {
        document.title = to.meta.title
      }else {
        document.title = "ToDoList"
      }
    }
  },

  created() {
    this.hasAuth()
  },
  mounted() {
    let to = this.$route
    this.createPageTitle(to)
    this.setIsLoading(false)
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
