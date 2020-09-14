<template>
  <div class="global_container">
    <header class="header_container">
      <div class="header_wrapper">
        <div class="todo_post">
          <input v-model="inputToDo" @keypress.enter="setToDo" type="text" placeholder="ToDoを入力してください" />
          <span></span>
          <button class="todo_post_add_btn" @click="setToDo">add</button>
        </div>
        <div v-if="userClass" class="user_info header-user_info_area">
          <p>{{userClass.userInfo.email}}さんのToDoListです</p>
          <button class="logout_btn" @click="logout">logout</button>
        </div>
      </div>
    </header>
    <main class="main_container">
      <Todos />
    </main>
    <!-- 入力をチェックしてモーダルを表示 -->
    <v-row justify="center">
      <v-dialog v-model="modalShow" max-width="450">
        <Modal :modal-comment="modalComment" @closeModal="closeModal"></Modal>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Todos from '../components/Todos'
import Modal from '../components/Modal'

export default {
  components: {
    Todos,
    Modal
  },
  data() {
    return {
      modalShow: false,
      modalComment: "modal comment",
      trashBox: {
        show: false,
        index: "",
      },
      inputToDo: "",
    };
  },
  computed: {
    ...mapGetters(["db", "firebase", "userInfo", "userClass"]),
    queryGetUserDB() {
      return this.db.collection("users").doc(this.userClass.userInfo.uid)
    }
  },

  methods: {
    ...mapMutations(["setUserInfo", "setIsLoading", "setUserClass"]),

    closeModal() {
      this.modalShow = false;
    },

    async getUserTextID() {
      const user = await this.queryGetUserDB.get()
      this.userClass.userPostNumber.setter = user.data().text_id;
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

    async incrementTextId() {
      const user = await this.db.collection("users").doc(this.userClass.userInfo.uid);
      await user.update({
        text_id: this.firebase.firestore.FieldValue.increment(1),
      });
    },

    async setToDo(ev) {
      ev.target.disabled = true;
      if (this.inputToDo != "" && this.inputToDo.length <= 30) {
        this.userClass.userPostNumber.setter = this.userClass.userPostNumber.getter + 1;
        this.queryGetUserDB
          .collection("todo_list")
          .doc()
          .set({
            text_id: this.userClass.userPostNumber.getter,
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
        // this.setUserClass(null)
    },

    //読み込み時に実行される関数内で実行するモジュール関数
    checkingSource(snapshot, caseLocalCallback, caseServerCallback = this.onlyReturnFunc) {
      const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
      if (source == "Local") {
        caseLocalCallback;
      } else if (source == "Server") {
        caseServerCallback;
      }
    },
    newTodoAddToTodosArray(snapshot) {
      snapshot.forEach((doc) => {
        this.checkingSource(doc, (doc) => {
          let hasData = this.userClass.todoList.some((el) => el.id == doc.data().id);
          if (!hasData) {
            this.userClass.unshiftTodolist(doc.data());
          }
        });
      });
    },
    resourceDataPushToTodosArray(snapshot) {
      this.userClass.modelsTodoList = [];
      snapshot.forEach((doc) => {
        this.userClass.pushTodoList(doc.data());
      });
    },

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
    async setNewAuthDBData() {
      const user = await this.firebase.auth().currentUser
      const userID = await this.db.collection("users").doc(user.uid).get()
      if(!userID.data()) {
        // this.setIsLoading(true)
        this.db.collection("users").doc(user.uid).set({
          text_id: 0,
          uid: user.uid,
          email: user.email,
          created_at: this.firebase.firestore.FieldValue.serverTimestamp()
        })
      }
    },

    async renderToDoList() {
      await this.setNewAuthDBData();
      this.getToDoListSnapshot();
      this.getUserTextID();
    }
  },
  created() {
    this.renderToDoList()
    // .catch((err) => console.log(err));
    },
  mounted() {
    this.setIsLoading(false)
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
  }
}
</style>