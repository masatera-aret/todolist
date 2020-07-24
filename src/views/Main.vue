<template>
  <div class="main">
    <header class="header">
      <div class="input-section-wrap">
        <div class="input-wrap">
          <input v-model="v_todo" type="text" value placeholder="ToDoを入力してください" />
          <span></span>
          <button class="enter-btn" @click="setToDo">
            <svg
              viewBox="0 0 16 16"
              class="bi bi-pencil-square"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
              />
              <path
                fill-rule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
              />
            </svg>
          </button>
        </div>
        <button class="logout-btn" v-if="isUser" @click="logout">logout</button>
      </div>
      <p>{{getUserData.email}}さんのToDoListです</p>
    </header>
    <main class="todos-wrap">
      <ul class="p-0">
        <li
          v-for="(todo, index) in this.todosArray"
          :key="todo.id"
          @mouseover="showUpTrashbox(index)"
          @mouseleave="hideTrashbox(index)"
        >
          <span>{{ todo }}</span>
          <div v-show="showTrashbox && index === trashboxIndex" class="trashbox">ゴミ箱</div>
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
      isUser: false,
      showBorder: {
        inFocus: false,
      },
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
  },
  methods: {
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
    this.firebase.auth().onAuthStateChanged((user) => {
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
                  this.todosArray.unshift(doc.data().todo);
                }
              });
            } else if (source == "server") {
              this.todosArray = [];
              snapshot.forEach((doc) => {
                this.todosArray.push(doc.data().todo);
              });
            }
          });
      } else {
        this.isUser = false;
      }
    });
  },
  mounted() {
    setTimeout(() => {
      this.$store.commit("setIsLoading", false);
    }, 1000);
  },
};
</script>

<style lang="scss" scoped>
.main {
  min-height: 100vh;
  display: grid;
  grid-template:
    "....  ....  ...." 20px
    ".... header ...." 60px
    "....  ....  ...." 20px
    "....  main  ...." 1fr
    /200px 1fr 200px;
}
.header {
  grid-area: header;
  // background-color:aqua;
}
.input-section-wrap {
  width: 100%;
  position: relative;
  // background-color:red;

  .input-wrap {
    width: 100%;
    border-bottom: 1px solid #adadad;
    position: relative;

    > input {
      width: calc(100% - 25px);
      border: none;
      outline: none;
      background: none;
    }

    > input::placeholder {
      color: #adadad;
      transition: 0.5s;
    }

    > input:focus::placeholder {
      color: transparent;
      transition: 0.5s;
    }

    > span::after {
      content: "";
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 0%;
      height: 1px;
      background-color: #6c5ce7;
      transition-property: width;
      transition-duration: 0.5s;
    }

    > input:focus + span::after {
      width: 100%;
      transition-duration: 0.5s;
    }

    .enter-btn {
      width: 25px;
      padding: 0;
      outline: none;
      background: none;
      border: none;

    .enter-btn:focus + svg {
      color: #6c5ce7;
        transition-duration: 0.5s;
    }

      > svg {
        width: 25px;
        color: #adadad;
      }
      > svg:hover {
        color: #6c5ce7;
        transition-duration: 0.5s;
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
    > li {
      margin-top: 10px;
      position: relative;
      > span::after {
        content: "";
        position: absolute;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        background-color: #adadad;
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
  }
}

.trashbox {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
}
</style>