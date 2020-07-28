<template>
  <div class="main">
    <header class="header">
      <div class="input-section-wrap">
        <div class="input-wrap">
          <input v-model="inputToDo" type="text" placeholder="ToDoを入力してください" />
          <span></span>
          <button class="add-btn" @click="setToDo">add</button>
        </div>
        <div v-if="isUser" class="logout-btn-wrap">
          <button class="logout-btn" @click="logout">logout</button>
          <p>{{getUserData.email}}さんのToDoListです</p>
        </div>
      </div>
    </header>
    <main class="todos-wrap">
      <transition-group name="fade" tag="ul" class="p-0">
        <li class="todo" v-for="(todo, index) in this.getTodosArray" :key="todo.id">
          <div class="dumy" @mouseover="showUpTrashbox(index)" @mouseleave="hideTrashbox(index)">
            <span
              v-if="todo.done == true"
              @click="doneIt(index,arguments[0])"
              class="done"
              :data-textid="todo.id"
            >
              {{ todo.todo }}
            </span>
            <span v-else @click="doneIt(index,arguments[0])" :data-textid="todo.id">{{ todo.todo }}</span>
            <div
              v-show="trashBox.show && index === trashBox.index"
              @click="deleteData(index)"
              class="trashbox"
              :data-textid="todo.id"
            >
              <i class="fas fa-trash-alt"></i>
            </div>
          </div>
        </li>
      </transition-group>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      trashBox:{
        show: false,
        index: ""
      },
      inputToDo: "",
      todosArray: [],
      isUser: false,
    };
  },
  computed: {
    db() {
      return this.$store.state.db;
    },
    firebase() {
      return this.$store.state.firebase;
    },
    getUserData() {
      return this.$store.state.userInfo;
    },
    getTodosArray() {
      return this.todosArray
    },
  },
  methods: {
    //認証ユーザー情報の取得
    isAuth() {
      this.firebase.auth().onAuthStateChanged((user) => {
        if(user) {
          this.isUser = true
          this.setUserInfo(user)
        }else {
          this.isUser = false
          this.setUserInfo(null)
        }
      })
    },
    getToDoListSnapshot() {
      return new Promise(resolve => {
      this.db.collection("todo_list").where("user", "==", this.$store.getters.userInfo.email).orderBy("id", "desc")
        .onSnapshot(snapshot => {
          const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
          if (source == "Local") {
              snapshot.forEach((doc) => {
                let docSource = doc.metadata.hasPendingWrites ? "Local" : "Server";
                if (docSource == "Local") {
                  let hasData = this.todosArray.some(el => el.id == doc.data().id)
                  if (!hasData) {
                    this.todosArray.unshift(doc.data())
                    resolve()
                  }
                }
              })
          } else if (source == "Server") {
            this.todosArray = [];
            snapshot.forEach((doc) => {
              this.todosArray.push(doc.data())
            })
            resolve()
          }
        })
      })
    },
    //firestoreに登録したtimestampのformatと、設定時間をlocal時間にする
    changeTimestampFormat() {
      console.log("start")
      this.todosArray.map(el => {
        el.timestamp = el.timestamp.toDate()
      })
      this.todosArray.forEach(el => {
        let date = el.timestamp
        let time = `${date.getFullYear()}/${(date.getMonth() + 1)}/${date.getDate()}`
        console.log(time)
      })
      console.log("end")
    },
    doneIt(index, ev) {
      this.db
        .collection("todo_list")
        .where("id", "==", this.todosArray[index].id)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            this.db
              .collection("todo_list")
              .doc(doc.id)
              .update({
                done: !doc.data().done,
              })
              .catch((err) => {
                console.log("update error:", err);
              });
          });
        })
        .catch((err) => {
          console.log("get error:", err);
        });
      ev.target.classList.toggle("done");
    },
    deleteData(index) {
      this.trashBox.show = false;
      this.db
        .collection("todo_list")
        .where("id", "==", this.todosArray[index].id)
        .get()
        .then((data) => {
          data.forEach((text) => {
            this.db
              .collection("todo_list")
              .doc(text.id)
              .delete()
              .then(() => {
                console.log("削除");
              })
              .catch((err) => {
                console.log("削除のエラー:", err);
              });
          });
        })
        .catch((err) => {
          console.log("削除のエラー:", err);
        });
    },
    showUpTrashbox(index) {
      this.trashBox.show = true;
      this.trashBox.index = index;
    },
    hideTrashbox(index) {
      this.trashBox.show = false;
      this.trashBox.index = index;
    },
    //firestoreへdataを追加 idを別コレクションから取得してそのidをtodoのidに追加
    setToDo() {
      if(this.inputToDo != "" && this.inputToDo.length <= 35) {
        this.db
          .collection("ID")
          .doc("textIdCounter")
          .get()
          .then((doc) => {
            return doc.data().textID + 1;
          })
          .then((id) => {
            this.db.collection("todo_list").doc().set({
              id: id,
              user: this.$store.state.userInfo.email,
              todo: this.inputToDo,
              done: false,
              timestamp: this.firebase.firestore.FieldValue.serverTimestamp()
            });
            this.db.collection("ID").doc("textIdCounter").set({
              textID: id,
            });
            this.inputToDo = "";
          });
      }else {
        this.inputToDo = "空はダメだよ？それか・・・文字数多い？"
      }
    },
    logout() {
      this.firebase
        .auth()
        .signOut()
        .then(() => {
          this.isUser = false
          console.log("ログアウトしました");
        })
        .catch((err) => {
          console.log("catch any error by sign out:", err);
        });
    },
    setUserInfo(userInfo) {
      this.$store.commit("setUserInfo", userInfo);
    },
  },
  beforeCreate() {
    this.$store.commit("setIsLoading", true);
  },
  created() {
    const renderToDoList = async () => {
      await this.isAuth()
      await this.getToDoListSnapshot()
      this.changeTimestampFormat()
    }
    renderToDoList().catch(err => console.log(err))
  },
  mounted() {
    this.$store.commit("setIsLoading", false);
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables";

.main {
  min-height: 100vh;
  display: grid;
  grid-template:
    "....  ....  ...." 20px
    ".... header ...."
    "....  ....  ...." 20px
    "....  main  ...." 1fr
    / auto 600px auto;
}
.header {
  grid-area: header;
}
.input-section-wrap {
  width: 100%;
  position: relative;

  .input-wrap {
    width: 100%;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: 0px;
      left: 0;
      width: 100%;
      height: 1px;
      // background-color: map-get($colors, "main-gray");
      background-color: map-get($colors, "main-gray");
      z-index: 0;
    }
    > input {
      width: calc(100% - 50px);
      border: none;
      outline: none;
      background: none;
    }

    > input::placeholder {
      color: map-get($colors, "main-gray");
      transition: 0.5s;
    }

    > input:focus::placeholder {
      color: transparent;
      transition: 0.5s;
    }

    > span::after {
      content: "";
      position: absolute;
      bottom: 0px;
      left: 0;
      width: 0%;
      height: 1px;
      background-color: map-get($colors, "main-purple");
      transition-property: width;
      transition-duration: 0.5s;
      z-index: 10;
    }

    > input:focus + span::after {
      width: 100%;
      transition-duration: 0.5s;
    }

    > input:focus ~ .add-btn {
      border: 1px solid map-get($colors, "main-purple");
      color: map-get($colors, "main-purple");
    }

    > input:focus .add-btn:hover ~ .add-btn {
      color: white;
    }

    .add-btn {
      width: 50px;
      padding: 0;
      background-color: white;
      color: map-get($colors, "main-gray");
      border: 1px solid map-get($colors, "main-gray");
      outline: none;
      box-sizing: border-box;
      transition-duration: 0.3s;

      &:hover,
      &:focus {
        border: 1px solid map-get($colors, "main-purple");
        background-color: map-get($colors, "main-purple");
        color: white !important;
        transition-duration: 0.3s;
      }
    }
  }

  .logout-btn-wrap {
    position:relative;
    // background-color: pink;
    // height:50px;
    margin-top: 20px;
    .logout-btn {
      color:white;
      outline:none;
      border:1px solid rgb(73, 73, 73);
      background-color:rgb(73, 73, 73);
      transition-duration: 0.3s;

      &:hover,&:focus {
        color:rgb(73, 73, 73);
        border:1px solid rgb(73, 73, 73);
        background-color:white;
        transition-duration: 0.3s;
      }
    }
    > p {
      position:absolute;
      top:0;
      right:0;
    }
  }
}

//////////////////////
/////////main/////////
//////////////////////

.todos-wrap {
  grid-area: main;
  > ul {
    list-style: none;
    > .todo {
      width: 600px;
      padding-top: 10px;
    }
  }
}

.dumy {
  position: relative;

  > span::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: map-get($colors, "main-gray");
    opacity: 0;
  }
  &:hover {
    > span::after {
      opacity: 1;
      transition: 0.5s;
    }
  }
  > span {
    cursor: pointer;
  }
}

.done {
  text-decoration: line-through;
  color: map-get($colors, "main-gray");
}

.trashbox {
  color: map-get($colors, "main-gray");
  position: absolute;
  top: 0;
  right: 0;
  // float: right;
  cursor: pointer;
}

//cssアニメーション

.fade-enter-active {
  // transition:opacity .5s;
  animation: fade-in 1s;
}
.fade-leave-active {
  // transition:opacity .5s;
  position: absolute;
  animation: fade-in 0.1s reverse;
}
.fade-move {
  transition: transform 0.5s;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>