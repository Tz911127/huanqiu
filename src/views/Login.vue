<template>
  <el-form
    :model="ruleForm2"
    :rules="rules2"
    ref="ruleForm2"
    label-position="left"
    label-width="0px"
    class="demo-ruleForm login-container"
  >
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input
        type="text"
        v-model="ruleForm2.account"
        auto-complete="off"
        placeholder="账号"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input
        type="password"
        v-model="ruleForm2.checkPass"
        auto-complete="off"
        placeholder="密码"
        clearable
      ></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button
        type="primary"
        style="width:100%;"
        @click.native.prevent="handleSubmit2"
        :loading="logining"
      >登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
import { requestLogin } from "../api/api";
import route from "../route.js";

var MD5 = require("md5.js");
export default {
  data() {
    return {
      logining: false,
      ruleForm2: {
        account: "",
        checkPass: ""
      },
      rules2: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        checkPass: [
          { required: true, message: "请输入密码", trigger: "blur" }

          //{ validator: validaePass2 }
        ]
      },
      checked: false,
      pwd: ""
    };
  },
  methods: {
    handleReset2() {
      this.$refs.ruleForm2.resetFields();
    },
    handleSubmit2(ev) {
      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          if (this.ruleForm2.checkPass.length == 32) {
            this.pwd = this.ruleForm2.checkPass;
          } else {
            this.pwd = new MD5().update(this.ruleForm2.checkPass).digest("hex");
          }

          this.logining = true;
          var loginParams = {
            userLoginname: this.ruleForm2.account,
            userPassword: this.pwd
          };
          window.localStorage.setItem("token", null);
          requestLogin(loginParams).then(token => {
            if (token.data.code == 20006) {
              this.$confirm(token.data.msg);
              this.logining = false;
            } else {
              if (token.data.code == 20004) {
                this.$confirm(token.data.msg);
                this.logining = false;
              } else {
                this.logining = false;
                let { msg, status, data } = token;
                // console.log(data.data);
                this.$store.commit("TOKEN", data.data.token);
                if (status !== 200) {
                  this.$message({
                    message: msg,
                    type: "error"
                  });
                } else {
                  window.localStorage.setItem(
                    "token",
                    JSON.stringify(data.data.token)
                  );
                  window.localStorage.setItem(
                    "role",
                    JSON.stringify(data.data.hiddenSystemCodeList)
                  );

                  let hiddenList = JSON.parse(
                    window.localStorage.getItem("role")
                  );

                  const loading = this.$loading({
                    lock: true,
                    text: "Loading",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)"
                  });
                  setTimeout(() => {
                    loading.close();
                  }, 2000);
                  if (hiddenList.length == 0) {
                    this.$router.push({ path: "/state" });
                  } else {
                    for (let i = 0; i < hiddenList.length; i++) {
                      if (hiddenList[i] === "MENU_BizFomatData") {
                        this.$router.push({ path: "/state" });
                      } 
                    }
                     this.$router.push({ path: "/" });
                  }

                  this.hideMenu(route, hiddenList);
                }
              }
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      this.change();
    },

    setCookie(c_name, c_pwd, exdays) {
      var exdate = new Date();
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays);
      document.cookie =
        "userName=" + c_name + ";path=/;expires=" + exdate.toLocaleString();
      document.cookie =
        "userPwd=" + c_pwd + ";path=/;expires=" + exdate.toLocaleString();
    },
    getCookie(userName) {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split("; ");
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split("=");
          if (arr2[0] == "userName") {
            this.ruleForm2.account = arr2[1];
          } else if (arr2[0] == "userPwd") {
            this.ruleForm2.checkPass = arr2[1];
          }
        }
      }
      if (this.ruleForm2.account != "") {
        this.checked = true;
      }
    },
    clearCookie: function() {
      this.setCookie("", "", -1);
    },
    change() {
      if (this.checked == true) {
        this.setCookie(this.ruleForm2.account, this.pwd, 3);
      } else {
        this.clearCookie();
      }
    },
    hideMenu(menus, hiddenList) {
      for (let i = 0, len = hiddenList.length; i < len; i++) {
        for (let j = 0, len2 = menus.length; j < len2; j++) {
          let menu = menus[j];
          if (menu.systemCode === hiddenList[i]) {
            menu.hidden = true;
          } else {
            if (menu.children) {
              this.hideMenu(menu.children, hiddenList);
            }
          }
        }
      }
    }
  },
  mounted() {
    this.getCookie();
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>