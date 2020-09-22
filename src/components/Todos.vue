<template>
  <transition-group name="fade" tag="ul" class="p-0">
    <li class="main-todo" v-for="(todo, index) in this.userClass.todoList" :key="todo.text_id">
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
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  data() {
    return {
      trashBox: {
        show: false,
        index: "",
      },
    }
  },
  computed: {
    ...mapGetters(["userClass"]),
    db() {
      return this.$store.state.db;
    },
    queryToUsersDatabase() {
      return this.db.collection("users").doc(this.userClass.userInfo.uid)
    }
  },

  methods: {
    ...mapMutations(["setUserClass"]),
    showTrashbox(index) {
      this.trashBox.show = true;
      this.trashBox.index = index;
    },
    hideTrashbox(index) {
      this.trashBox.show = false;
      this.trashBox.index = index;
    },

    async doneIt(index, ev) {
      ev.target.classList.toggle("todo_done");
      const getThis = await this.queryToUsersDatabase
        .collection("todo_list")
        .where("text_id", "==", this.userClass.todoList[index].text_id)
        .get()
        .catch((err) => console.log("get error:", err));
      getThis.forEach((doc) => {
        this.queryToUsersDatabase
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
      try {
        const deleteThing = await this.queryToUsersDatabase
          .collection("todo_list")
          .where("text_id", "==", this.userClass.todoList[index].text_id)
          .get()
        deleteThing.forEach((doc) => {
          this.queryToUsersDatabase
            .collection("todo_list")
            .doc(doc.id)
            .delete()
        })
      }
      catch(err) {
        console.log(err)
      }
    },

    mounted() {
      console.log(this.userClass.todoList)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables";

.main-todo {
  width: 600px;
  padding-top: 10px;
  @media screen and (max-width: 600px) {
    width: 100%;
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
      pointer-events: none;
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