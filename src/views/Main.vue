<template>
  <div class="main">
    <header class="enter-bar">
      <input v-model="v_todo" type="text">
      <button @click="setToDo">enter</button>
    </header>
    <main class="todos-wrap">
      <ul class="p-0">
        <li v-for="(todo, index) in this.todosArray" :key="todo.id" @mouseover="showUpTrashbox(index)" @mouseleave="hideTrashbox(index)">
          <span>{{ todo }}</span><div v-show="isTrashbox && index === trashboxIndex" class="trashbox">ゴミ箱</div>
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
      isTrashbox: false,
      trashboxIndex: "",
      db: firebase.firestore(),
      v_todo: "",
      todosArray: []
    }
  },
  methods: {
    showUpTrashbox(index) {
      this.isTrashbox = true
      this.trashboxIndex = index
    },
    hideTrashbox(index) {
      this.isTrashbox = false
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
      &:hover {
        >span::after {
          content:"";
          position: absolute;
          left:0;
          bottom:0;
          width:100%;
          height:2px;
          background-color:rgb(191, 191, 191);
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