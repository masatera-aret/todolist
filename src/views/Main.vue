<template>
  <div class="global_container">
    <header class="header_container">
      <div class="header_wrapper">
        <div class="todo_post">
          <input v-model="inputToDo" type="text" placeholder="ToDoを入力してください" />
          <span></span>
          <button class="todo_post_add_btn" @click="setToDo">add</button>
        </div>
        <div v-if="isUser" class="user_info header-user_info_area">
          <p>{{getUserData.email}}さんのToDoListです</p>
          <button class="logout_btn" @click="logout">logout</button>
        </div>
      </div>
    </header>
    <main class="main_container">
      <transition-group name="fade" tag="ul" class="p-0">
        <li class="main-todo" v-for="(todo, index) in this.getTodosArray" :key="todo.text_id">
          <div
            class="main-todo_post_wrap"
            @mouseover="showTrashbox(index)"
            @mouseleave="hideTrashbox(index)"
          >
            <span
              v-if="todo.done == true"
              @click="doneIt(index,arguments[0])"
              class="todo_done"
              :data-textid="todo.text_id"
            >{{ todo.text }}</span>
            <span
              v-else
              @click="doneIt(index,arguments[0])"
              :data-textid="todo.text_id"
            >{{ todo.text }}</span>
            <div
              v-show="trashBox.show && index === trashBox.index"
              @click="deleteTodo(index)"
              class="trashbox"
              :data-textid="todo.text_id"
            >
              <i class="fas fa-trash-alt"></i>
            </div>
          </div>
        </li>
      </transition-group>
    </main>
    <!-- 文字数オーバーで表示するモーダル -->
    <b-modal
      v-model="modalShow"
      :ok-only="bModal.okOnly"
      :hide-header="bModal.hideHeader"
      button-size="sm"
      ok-variant="secondary"
      footer-border-variant="white"
    >{{ modalComment }}</b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bModal: {
        okOnly: true,
        hideHeader: true,
      },
      modalShow: false,
      modalComment: "modal comment",
      trashBox: {
        show: false,
        index: "",
      },
      inputToDo: "",
      todosArray: [],
      userTextId: 0,
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
      return this.todosArray;
    },
    queryGetUserDB() {
      return this.db.collection("users").doc(this.getUserData.uid)
    }
  },
  methods: {
    async getuserTextId() {
      const user = await this.queryGetUserDB.get();
      this.userTextId = user.data().text_id;
    },
    //認証ユーザー情報の取得
    hasAuth() {
      this.firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.isUser = true;
          this.setUserInfo(user);
        } else {
          this.isUser = false;
          this.setUserInfo(null);
        }
      });
    },

    //読み込み時に実行される関数内で実行するモジュール関数
    checkingSource(snapshot, localCb, serverCb = this.onlyReturnFunc) {
      const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
      if (source == "Local") {
        localCb;
      } else if (source == "Server") {
        serverCb;
      }
    },
    newTodoAddToTodosArray(snapshot) {
      snapshot.forEach((doc) => {
        this.checkingSource(doc, (doc) => {
          let hasData = this.todosArray.some((el) => el.id == doc.data().id);
          if (!hasData) {
            this.todosArray.unshift(doc.data());
          }
        });
      });
    },
    resourceDataPushToTodosArray(snapshot) {
      this.todosArray = [];
      snapshot.forEach((doc) => {
        this.todosArray.push(doc.data());
      });
    },
    // newTodoAdd(doc) {
    //   let hasData = this.todosArray.some((el) => el.id == doc.data().id);
    //   if (!hasData) {
    //     this.todosArray.unshift(doc.data());
    //   }
    // },
    onlyReturnFunc() {
      return;
    },

    //読み込み時に実行される関数
    async getToDoListSnapshot() {
      await this.queryGetUserDB
        .collection("todo_list")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          this.checkingSource(
            snapshot,
            this.newTodoAddToTodosArray(snapshot),
            this.resourceDataPushToTodosArray(snapshot)
          );
        }, this.onlyReturnFunc);
    },
    //todoの実行済みかどうかを反映させる
    async doneIt(index, ev) {
      ev.target.classList.toggle("todo_done");
      const getThis = await this.queryGetUserDB
        .collection("todo_list")
        .where("text_id", "==", this.getTodosArray[index].text_id)
        .get()
        .catch((err) => console.log("get error:", err));
      getThis.forEach((doc) => {
        this.queryGetUserDB
          .collection("todo_list")
          .doc(doc.id)
          .update({
            done: !doc.data().done,
          })
          .catch((err) => console.log("update error:", err));
      });
    },

    async deleteTodo(index) {
      this.trashBox.show = false;
      const deleteThing = await this.queryGetUserDB
        .collection("todo_list")
        .where("text_id", "==", this.todosArray[index].text_id)
        .get()
        .catch((err) => console.log("getのエラー:", err));
      deleteThing.forEach((text) => {
        this.queryGetUserDB
          .collection("todo_list")
          .doc(text.id)
          .delete()
          .catch((err) => console.log("削除のエラー:", err));
        console.log("削除しました");
      });
    },

    showTrashbox(index) {
      this.trashBox.show = true;
      this.trashBox.index = index;
    },
    hideTrashbox(index) {
      this.trashBox.show = false;
      this.trashBox.index = index;
    },

    async updateIncrementID() {
      const IncrementIDRef = this.db.collection("ID").doc("textIdCounter");
      await IncrementIDRef.update({
        textID: this.firebase.firestore.FieldValue.increment(1),
      });
    },

    async getIncrementID() {
      const getIDRef = await this.db
        .collection("ID")
        .doc("textIdCounter")
        .get();
      return getIDRef.data().textID;
    },

    async getThisUserTextId() {
      const user = await this.queryGetUserDB
        .get();
      return user.data().text_id;
    },

    async incrementTextId() {
      const user = await this.db.collection("users").doc(this.getUserData.uid);
      await user.update({
        text_id: this.firebase.firestore.FieldValue.increment(1),
      });
    },

    async setToDo(ev) {
      ev.target.disabled = true;
      if (this.inputToDo != "" && this.inputToDo.length <= 30) {
        this.userTextId += 1;
        this.queryGetUserDB
          .collection("todo_list")
          .doc()
          .set({
            text_id: this.userTextId,
            text: this.inputToDo,
            done: false,
            timestamp: this.firebase.firestore.FieldValue.serverTimestamp(),
          });
        this.inputToDo = "";
        this.incrementTextId();
      } else if (this.inputToDo == "") {
        this.modalComment = "未入力です";
        this.modalShow = true;
      } else if (this.inputToDo.length > 30) {
        this.modalComment = "入力可能文字数は30文字までです。";
        this.modalShow = true;
      }
      ev.target.disabled = false;
    },

    async logout() {
      await this.firebase
        .auth()
        .signOut()
        .catch((err) => console.log("catch any error by sign out:", err));
      this.isUser = false;
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
      await this.hasAuth();
      await this.getToDoListSnapshot();
      this.getuserTextId();
      // this.changeTimestampFormat()
    };
    renderToDoList().catch((err) => console.log(err));
  },
  mounted() {
    this.$store.commit("setIsLoading", false);
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables";

.global_container {
  min-height: 100vh;
  display: grid;
  grid-template:
    "....  ....  ...." 20px
    ".... header ...."
    "....  ....  ...." 40px
    "....  main  ...." 1fr
    / auto 600px auto;

  @media screen and (max-width: 600px) {
    grid-template:
      "....  ....  ...." 20px
      ".... header ...."
      "....  ....  ...." 40px
      "....  main  ...." 1fr
      / auto 90% auto;
  }
}

.header_container {
  grid-area: header;
}

.header_wrapper {
  width: 100%;
  position: relative;
}

.todo_post {
  width: 100%;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: map-get($colors, "light_gray");
    z-index: 0;
  }
  > input {
    width: calc(100% - 50px);
    border: none;
    outline: none;
    background: none;
  }
  > input::placeholder {
    color: map-get($colors, "light_gray");
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
    background-color: map-get($colors, "dark_gray");
    transition-property: width;
    transition-duration: 0.5s;
    z-index: 10;
  }
  > input:focus + span::after {
    width: 100%;
    transition-duration: 0.5s;
  }
  > input:focus ~ &-add_btn {
    border: 1px solid map-get($colors, "dark_gray");
    color: map-get($colors, "dark_gray");
  }
  > input:focus &-add_btn:hover ~ &-add_btn {
    color: white;
  }
}

.todo_post_add_btn {
  width: 50px;
  padding: 0;
  background-color: white;
  color: map-get($colors, "light_gray");
  border: 1px solid map-get($colors, "light_gray");
  outline: none;
  box-sizing: border-box;
  transition-duration: 0.3s;

  &:hover,
  &:focus {
    border: 1px solid map-get($colors, "dark_gray");
    background-color: map-get($colors, "dark_gray");
    color: white !important;
    transition-duration: 0.3s;
  }
}

.user_info {
  position: relative;
  margin-top: 20px;

  > p {
    position: absolute;
    top: 0;
    right: 0;
  }
  @media screen and (max-width: 600px) {
    position: static;
    text-align: center;
    P {
      position: static;
    }
  }
}

.logout_btn {
  color: map-get($colors, "light_gray");
  outline: none;
  border: 1px solid map-get($colors, "light_gray");
  background-color: white;
  transition-duration: 0.3s;

  &:hover,
  &:focus {
    color: white;
    border: 1px solid map-get($colors, "dark_gray");
    background-color: map-get($colors, "dark_gray");
    transition-duration: 0.3s;
  }
}

//////////////////////
/////////main/////////
//////////////////////

.main_container {
  grid-area: main;
  > ul {
    list-style: none;
    > .main-todo {
      width: 600px;
      padding-top: 10px;
      @media screen and (max-width: 600px) {
        width: 100%;
      }
    }
  }
}

.main-todo_post_wrap {
  position: relative;

  > span::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: map-get($colors, "light_gray");
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

.todo_done {
  text-decoration: line-through;
  color: map-get($colors, "light_gray");
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
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  animation: fade-in 1s;
  // animation-delay: .5s;
}
.fade-enter-to {
  opacity: 0;
}
.fade-leave-active {
  position: absolute;
  animation: fade-in 0.1s reverse;
}
.fade-move {
  transition: transform 0.2s;
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