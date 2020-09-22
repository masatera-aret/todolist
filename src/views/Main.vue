<template>
  <div class="global_container">
    <header class="header_container">
      <Header @modalState="catchModalState" />
    </header>
    <main class="main_container">
      <Todos v-if="userClass" />
    </main>
    <!-- 入力をチェックしてモーダルを表示 -->
    <v-row v-show="modal.show" justify="center">
      <v-dialog v-model="modal.show" max-width="450">
        <Modal :modal-comment="modal.comment" @closeModal="modal.show = false" />
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Todos from '../components/Todos'
import Modal from '../components/Modal'
import Header from '../components/Header'

export default {
  components: {
    Todos,
    Modal,
    Header
  },
  data() {
    return {
      inputToDo: "",

      modal: {
        show: false,
        comment: "modal comment"
      },
    }
  },
  computed: {
    ...mapGetters(["db", "firebase", "userInfo", "userClass"]),
    queryGetUserDB() {
      return this.db.collection("users").doc(this.userClass.userInfo.uid)
    }
  },

  methods: {
    ...mapMutations(["setUserInfo", "setIsLoading", "setUserClass"]),

    //Header.vueからmodalの状態を受け取る
    catchModalState(modalState) {
      this.modal = modalState
    },

    async getuserTextId() {
      const user = await this.queryGetUserDB.get()
      this.userClass.userPostNumber.setter = user.data().text_id;
      // console.log(this.userClass.userPostNumber.getter)
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
      //TodoListを毎回初期化
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

    async renderToDoList() {
      await this.getToDoListSnapshot();
      this.getuserTextId();
    }
  },

  mounted() {
    this.renderToDoList().catch((err) => console.log(err));
    this.setIsLoading(false);
  },
};
</script>






<style lang="scss" scoped>

.global_container {
  min-height: 100vh;
  display: grid;
  grid-template:
    "....  ....  ...." 20px
    ".... header ...."
    "....  ....  ...." 40px
    "....  main  ...." 1fr
    / auto clamp(300px, 70vw, 800px) auto;

}

.header_container {
  grid-area: header;
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