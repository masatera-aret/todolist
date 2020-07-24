<template>
  <div class="account">
    <main class="account-box">
      <div class="account-parts-wrapp">
        <h2 class="text-center">Login</h2>
        <div class="account-input-wrapp">
          <input v-model="email" @focus="inFocus" @blur="outFocus" type="email" />
          <span data-placeholder="Email"></span>
        </div>
        <div class="account-input-wrapp">
          <input v-model="password" @focus="inFocus" @blur="outFocus" type="password" />
          <span data-placeholder="password"></span>
        </div>
        <button class="submit_btn" :class="inputCheck" @click="toLogin">login</button>
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
      password: "",
      emailRegexp:/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/
    }
  },
  computed: {
    firebase() {
      return this.$store.state.firebase
    },
    inputCheck() {
      if(this.emailRegexp.test(this.email) && this.password.length >= 6) {
        return {btnClickPermission: true}
      }else {
        return {btnClickPermission: false}
      }
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
    },
    inFocus(ev) {
      ev.target.classList.add("inFocus")
    },
    outFocus(ev) {
      if(ev.target.value == "") {
        ev.target.classList.remove("inFocus")
        ev.target.classList.remove("outFocus")
      }else {
        ev.target.classList.add("outFocus")
      }
    }
  },
}
</script>

<style lang="scss">

.account {
  width: 100%;
  min-height: 100vh;
  display:grid;
  grid-template:
  ".... .... ...."
  ".... main ...." 450px
  ".... .... ...."
  /auto 350px auto;
}

.account-box {
  grid-area: main;
  padding: 20px;
  border: 1px solid rgb(108, 108, 108);

  .account-parts-wrapp {
    display: flex;
    flex-direction: column;

    .account-input-wrapp {
      margin-top:25px;
      position:relative;
      border-bottom: 1px solid #adadad;

      > span::before {
        content: attr(data-placeholder);
        position: absolute;
        top: 50%;
        left: 5px;
        color: #999;
        z-index: -1;
        transform: translateY(-50%);
        transition: 0.5s;
      }
      > span::after {
        content: "";
        position: absolute;
        bottom:-1px;
        left:0;
        width:0%;
        height:1px;
        background-color:#6c5ce7;
        transition: 0.5s;
      }
    }


    .inFocus + span::before {
      top: -10px;
      color: #999;
    }

    .inFocus + span::after {
      width: 100%;
    }

    .outFocus + span::before {
      color: #6c5ce7;
      // color: black;
    }

    input {
      width: 100%;
      padding: 5px;
      border: none;
      outline: none;
      background: none;
    }

    .submit_btn {
      color: white;
      height: 35px;
      margin-top: 35px;
      background-color: rgb(220, 220, 220);
      border: none;
      pointer-events: none;
      transition: 0.5s;
    }
    .btnClickPermission {
      pointer-events: auto;
      background-color: rgb(145, 145, 145);
      transition: 0.5s;
    }
  }
}


</style>