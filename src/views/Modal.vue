<template>
  <div class="test_modal">
      <div>
        <input v-model="text" type="text">
        <b-button @click="check">Open Modal</b-button>

        <b-modal
          v-model="modalShow"
          ok-only=ture
          hide-header=true
          button-size="sm"
          ok-variant="secondary"
          footer-border-variant="white"
        >
        入力可能文字数をオーバーしました<br>
        文字は5文字まで入力が可能です
        </b-modal>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text:"",
      modalShow:false
    }
  },
  methods: {
    check() {
      if(this.text.length >= 5) {
        this.modalShow = true
      }else {
        this.modalShow = false
      }

    }
  }
}
</script>

<style lang="scss" scoped>
.test {
  color:red;
}
.test_modal {
  width:100vw;
  height:100vh;
  background-color:rgb(210, 190, 187);
}

</style>