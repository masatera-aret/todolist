<template>
  <div class="main">
    <header class="enter-bar">
      <input v-model="v_todo" type="text">
      <button @click="setToDo">enter</button>
    </header>
    <main class="todos-wrap">
      <ul>
        <li v-for="todo in this.todosArray" :key="todo.id">
          <span>{{ todo }}</span>
        </li>
      </ul>
    </main>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/app'
import 'firebase/firestore'

export default {
  data() {
    return {
      db: firebase.firestore(),
      v_todo: "",
      todosArray: []
    }
  },
  methods: {
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
          todo: this.v_todo
        })
        this.db.collection('ID').doc("textIdCounter")
        .set({
          textID: id
        })
        this.v_todo = ""
      })
    },
  },
  created() {
    //firestoreからdataを取得 & onSnapshotで監視
    this.db.collection('todo_list').orderBy("id", "desc")
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
    })
  }
}
</script>

<style lang="scss" scoped>
.main {
  min-height: 100vh;
  display: grid;
  grid-template:
    "header" 60px
    "......" 20px
    "main  " 1fr
    /100%;
}
.enter-bar {
  grid-area: header;
  background-color:aqua;
}
.todos-wrap {
  grid-area: main;
  padding: 10px;
  background-color: greenyellow;
  > ul {
    list-style:none;
    > li {
      margin-top: 5px;
      > span {
        cursor:pointer;
      }
    }
  }
}
</style>