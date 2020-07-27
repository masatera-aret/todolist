<template>
  <div class="main">
    <header class="header">
      <div class="input-section-wrap">
        <div class="input-wrap">
          <input v-model="v_todo" type="text" value placeholder="ToDoを入力してください" />
          <span></span>
          <button class="add-btn" @click="setToDo">
            add
          </button>
        </div>
        <button class="logout-btn" v-if="isUser" @click="logout">logout</button>
      </div>
      <p>{{getUserData.email}}さんのToDoListです</p>
    </header>
    <main class="todos-wrap">
      <transition-group name="fade" tag="ul" class="p-0">
        <li
          class="todo"
          v-for="(todo, index) in this.getTodosArray"
          :key="todo.id"
        >
          <div class="dumy"
            @mouseover="showUpTrashbox(index)"
            @mouseleave="hideTrashbox(index)"
          >
            <span v-if="todo.done == true" @click="doneIt(index,arguments[0])" class="done" :data-textid="todo.id">{{ todo.todo }}</span>
            <span v-else @click="doneIt(index,arguments[0])" :data-textid="todo.id">{{ todo.todo }}</span>
            <div
              v-show="showTrashbox && index === trashboxIndex"
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
      showTrashbox: false,
      trashDelete: true,
      trashboxIndex: "",
      v_todo: "",
      todosArray: [],
      isUser: false,
      showBorder: {inFocus: false},
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
    }
  },
  methods: {
    doneIt(index,ev) {
      this.db
          .collection("todo_list").where("id", "==", this.todosArray[index].id).get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              this.db.collection("todo_list").doc(doc.id).update({
                done: !doc.data().done
              })
              .catch(err => {
                console.log("update error:", err)
              })
            })
          })
          .catch(err => {
            console.log("get error:",err)
          })
      ev.target.classList.toggle("done")
    },
    deleteData(index) {
      this.showTrashbox = false
      // this.trashboxIndex = index
      // console.log(this.todosArray[index].id)
      // this.todosArray.splice(index,1)
      this.db.collection("todo_list").where("id","==",this.todosArray[index].id).get()
        .then( (data) => {
          data.forEach(text => {
            this.db.collection("todo_list").doc(text.id).delete()
              .then(() => {
                console.log("削除")
              })
              .catch(err => {
                console.log("削除のエラー:",err)
              })
          })
        })
        .catch(err => {
          console.log("削除のエラー:",err)
        })
    },
    showUpTrashbox(index) {
      this.showTrashbox = true;
      this.trashboxIndex = index;
    },
    hideTrashbox(index) {
      this.showTrashbox = false;
      this.trashboxIndex = index;
    },
    //firestoreへdataを追加 idを別コレクションから取得してそのidをtodoのidに追加
    setToDo() {
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
            todo: this.v_todo,
            done: false,
            user: this.$store.state.userInfo.email,
          });
          this.db.collection("ID").doc("textIdCounter").set({
            textID: id,
          });
          this.v_todo = "";
        });
    },
    logout() {
      this.firebase
        .auth()
        .signOut()
        .then(() => {
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
    this.firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setUserInfo(user);
        this.isUser = true;
        this.db
          .collection("todo_list")
          .where("user", "==", user.email)
          .orderBy("id", "desc")
          .onSnapshot((snapshot) => {
            const source = snapshot.metadata.hasPendingWrites ? "Local" : "server";
            if (source == "Local") {
              snapshot.forEach((doc) => {
                let docSource = doc.metadata.hasPendingWrites ? "Local" : "server";
                if (docSource == "Local") {
                  let isData = this.todosArray.some(el => el.id == doc.data().id)
                  if(!isData) {
                    this.todosArray.unshift(doc.data())
                  }
                }
              });
            } else if (source == "server") {
              this.todosArray = [];
              snapshot.forEach((doc) => {
                this.todosArray.push(doc.data())
              });
            }
          });
      } else {
        this.isUser = false;
      }
    });
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
    ".... header ...." 60px
    "....  ....  ...." 20px
    "....  main  ...." 1fr
    /auto 600px auto;
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
      content:"";
      position: absolute;
      bottom: 0px;
      left: 0;
      width: 100%;
      height: 1px;
      // background-color: map-get($colors, "main-gray");
      background-color: map-get($colors, "main-gray");
      z-index:0;
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
      z-index:10;
    }

    > input:focus + span::after {
      width: 100%;
      transition-duration: 0.5s;
    }

    > input:focus ~ .add-btn {
      border: 1px solid map-get($colors, "main-purple");
      color:map-get($colors, "main-purple");
    }

    > input:focus .add-btn:hover ~ .add-btn {
      color:white;
    }

    .add-btn {
      width: 50px;
      padding: 0;
      background-color: white;
      color:map-get($colors, "main-gray");
      border: 1px solid map-get($colors, "main-gray");
      outline:none;
      box-sizing:border-box;
      transition-duration: .3s;

      &:hover,
      &:focus {
        border: 1px solid map-get($colors, "main-purple");
        background-color:map-get($colors, "main-purple");
        color:white !important;
        transition-duration: .3s;
      }
    }
  }

  .logout-btn {
    float: right;
  }
}

.todos-wrap {
  grid-area: main;
  > ul {
    list-style: none;
    > .todo {
      width:600px;
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
    opacity:0;
  }
  &:hover {
    > span::after {
      opacity:1;
      transition: 0.5s;
    }
  }
  > span {
    cursor: pointer;
  }
}

.done {
  text-decoration:line-through;
  color:map-get($colors, "main-gray");
}

.trashbox {
  color:map-get($colors, "main-gray");
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
  animation: fade-in .1s reverse;
}
.fade-move {
  transition: transform .5s;
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