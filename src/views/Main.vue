<template>
  <div class="main">
    <header class="enter-bar">
      <input v-model="v_todo" type="text">
      <button @click="setToDo">enter</button>
      <button v-if="isUser" @click="logout">logout</button>
      <p>{{getUserData.email}}さんのページ</p>
    </header>
    <main class="todos-wrap">
      <ul class="p-0">
        <li v-for="(todo, index) in this.todosArray" :key="todo.id" @mouseover="showUpTrashbox(index)" @mouseleave="hideTrashbox(index)">
          <span>{{ todo }}</span><div v-show="showTrashbox && index === trashboxIndex" class="trashbox">ゴミ箱</div>
        </li>
      </ul>
    </main>
  </div>
</template>

<script>

export default {
  data() {
    return {
      showTrashbox: false,
      trashboxIndex: "",
      v_todo: "",
      todosArray: [],
      isUser: false
    }
  },
  computed: {
    db() {
      return this.$store.state.db
    },
    firebase() {
      return this.$store.state.firebase
    },
    getUserData() {
      return this.$store.state.userInfo
    }
  },
  methods: {
    showUpTrashbox(index) {
      this.showTrashbox = true
      this.trashboxIndex = index
    },
    hideTrashbox(index) {
      this.showTrashbox = false
      this.trashboxIndex = index
    },
    //firestoreへdataを追加 idを別コレクションから取得してそのidをtodoのidに追加
    setToDo() {
      this.db.collection('ID').doc("textIdCounter")
      .get()
      .then(doc => {
        return doc.data().textID + 1
      })
      .then(id => {
        this.db.collection('todo_list').doc()
        .set({
          id: id,
          todo: this.v_todo,
          user: this.$store.state.userInfo.email
        })
        this.db.collection('ID').doc("textIdCounter")
        .set({
          textID: id
        })
        this.v_todo = ""
      })
    },
    logout() {
      this.firebase.auth().signOut()
      .then(() => {
        console.log("ログアウトしました")
      })
      .catch(err => {
        console.log("catch any error by sign out:", err)
      })
    },
    setUserInfo(userInfo) {
      this.$store.commit("setUserInfo", userInfo);
    },
  },
  created() {
    this.firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setUserInfo(user)
        this.isUser = true
        this.db.collection('todo_list').where("user","==", user.email).orderBy("id", "desc")
        .onSnapshot(snapshot => {
          const source = snapshot.metadata.hasPendingWrites ? "Local" : "server"
          if(source == "Local") {
            snapshot.forEach(doc => {
              let docSource = doc.metadata.hasPendingWrites ? "Local" : "server"
              if(docSource == "Local") {
                this.todosArray.unshift(doc.data().todo)
              }
            })
          }else if(source == "server") {
            this.todosArray = []
            snapshot.forEach(doc => {
              this.todosArray.push(doc.data().todo)
            })
          }
        });
      }else {
        this.isUser = false;
      }
    });
    //firestoreからdataを取得 & onSnapshotで監視
  }
}
</script>

<style lang="scss" scoped>
.main {
  min-height: 100vh;
  display: grid;
  grid-template:
    ".... header ...." 60px
    ".... ....   ...." 20px
    ".... main   ...." 1fr
    /200px 1fr 200px;
}
.enter-bar {
  grid-area: header;
  // background-color:aqua;
}
.todos-wrap {
  grid-area: main;
  padding: 10px;
  // background-color: greenyellow;
  > ul {
    list-style:none;
    > li {
      margin-top: 10px;
      position: relative;
      >span::after {
        content:"";
        position: absolute;
        left:0;
        bottom:0;
        width:0%;
        height:1px;
        background-color:rgb(226, 226, 226);
        transition: 0.5s;
      }
      &:hover {
        >span::after {
          width:100%;
        }
      }
      >span {
        cursor:pointer;
      }
    }
  }
}

.trashbox {
  position: absolute;
  top:0;
  right: 0;
  cursor:pointer;
}

</style>