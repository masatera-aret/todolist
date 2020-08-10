export const LoginSigninMixin = {
  data() {
    return {
      email: "",
      password: "",
      emailStatus: { in_focus: false, out_focus: false },
      passwordStatus: { in_focus: false, out_focus: false },
      emailRegexp:/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/,
    }
  },
  computed: {
    firebase() {
      return this.$store.getters.firebase
    },
    inputRuleJudging() {
      if(this.emailRegexp.test(this.email) && (this.password.length >= 6 && this.password.length < 20)) {
        return {btn_click_permission: true}
      }else {
        return {btn_click_permission: false}
      }
    },
    tabindex() {
      if(this.emailRegexp.test(this.email) && (this.password.length >= 6 && this.password.length < 20)) {
        return "0"
      }else {
        return "-1"
      }
    }
  },
  watch: {
    email: function () {
      if (this.emailRegexp.test(this.email)) {
        this.emailStatus.in_focus = true
        this.emailStatus.out_focus = true
      } else {
        this.emailStatus.in_focus = true
        this.emailStatus.out_focus = false
      }
    },
    password: function () {
      if (this.password.length >= 6 && this.password.length <= 20) {
        this.passwordStatus.in_focus = true
        this.passwordStatus.out_focus = true
      }else {
        this.passwordStatus.in_focus = true
        this.passwordStatus.out_focus = false
      }
    }
  },
  methods: {
    inFocus(ev) {
      ev.target.classList.add("in_focus");
    },

    outFocus(ev) {
      const el = ev.target;
      if (el.value == "") {
        el.classList.remove("in_focus");
      }
    }
  }
}