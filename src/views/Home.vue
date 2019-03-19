<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
        <img :src="this.sysLogo">
      </el-col>
      <!-- <el-col :span="4">
				<div class="tools" @click.prevent="collapse">
				</div>
      </el-col>-->
      <el-col :span="14" class="userinfo">
        <el-button type="primary" @click="open">参数设置</el-button>
        <el-button type="primary" @click.native="logout">退出登录</el-button>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <!--导航菜单-->
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          @open="handleopen"
          @close="handleclose"
          @select="handleselect"
          unique-opened
          router
          v-show="!collapsed"
        >
          <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
            <el-submenu :index="index+''" :key="index" v-if="!item.leaf">
              <template slot="title">
                <i :class="item.iconCls"></i>
                {{item.name}}
              </template>
              <el-menu-item
                v-for="child in item.children"
                :index="child.path"
                :key="child.path"
                v-if="!child.hidden"
              >{{child.name}}</el-menu-item>
            </el-submenu>
            <el-menu-item
              v-if="item.leaf&&item.children.length>0"
              :key="index"
              :index="item.children[0].path"
            >
              <i :class="item.iconCls"></i>
              {{item.children[0].name}}
            </el-menu-item>
          </template>
        </el-menu>
      </aside>
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="breadcrumb-container">
            <strong class="title">{{$route.name}}</strong>
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">{{ item.name }}</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
    <el-dialog title="参数设置" :visible.sync="dialogFormVisible">
      <el-form :model="createForm" ref="createForm" :rules="rules" style="100%" label-width="120px">
        <el-form-item label="开关机时间" prop="on_off">
          <el-input v-model="createForm.on_off"></el-input>
        </el-form-item>
        <el-form-item label="轮播间隔时间(s)" prop="delay">
          <el-input v-model="createForm.delay"></el-input>
        </el-form-item>
        <el-form-item label="屏保时长(s)" prop="protect">
          <el-input v-model="createForm.protect"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createData('createForm')">确认</el-button>
          <el-button @click.native="resetForm('createForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-row>
</template>

<script>
import logo from "../assets/logo.png";
import { config, getConfig, loginOut, getToken } from "../api/api";

export default {
  data() {
    return {
      sysName: "环球海",
      sysLogo: logo,
      collapsed: false,
      sysUserName: "",
      sysUserAvatar: "",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      dialogFormVisible: false,
      createForm: {
        on_off: "",
        delay: 0,
        protect: 0
      },
      startTime: "",
      endTime: "",
      rules: {
        on_off: [
          {
            // type: "date",
            required: true,
            message: "请输入开关机时间",
            trigger: "change"
          }
        ],
        delay: [
          { required: true, message: "请输入轮播间隔时间", trigger: "blur" }
        ],
        protect: [
          { required: true, message: "请输入屏保时长", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.isTimeout();
  },
  methods: {
    isTimeout() {
      setTimeout(() => {
        let para = window.localStorage.getItem("token");
        getToken(para).then(res => {
          window.localStorage.setItem("token", JSON.stringify(res.data.data));
        });
      }, 60 * 60 * 1000);
    },
    handleopen() {
      //console.log('handleopen');
    },
    handleclose() {
      //console.log('handleclose');
    },
    handleselect: function(a, b) {},
    //退出登录
    logout: function() {
      var _this = this;
      this.$confirm("确认退出吗?", "提示", {
        //type: 'warning'
      })
        .then(() => {
          // sessionStorage.removeItem("user");
          let para = window.localStorage.getItem("token");
          loginOut(para).then(res => {
            _this.$router.push("/login");
          });
          _this.$router.push("/login");
        })
        .catch(() => {});
    },
    //折叠导航栏

    open() {
      this.dialogFormVisible = true;
      this.getfig();
    },
    createData(createForm) {
      this.$refs[createForm].validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.createForm);

          config(para).then(res => {
            if (res.data.code == 10001) {
              this.$confirm(res.data.data);
            } else {
              this.dialogFormVisible = false;
              this.$refs[createForm].resetFields();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(createForm) {
      this.dialogFormVisible = false;
      this.$refs[createForm].resetFields();
    },
    getfig() {
      getConfig().then(res => {
        this.createForm = res.data.data;
      });
    },
    getRole() {
      let hiddenList = JSON.parse(window.localStorage.getItem("role"));

      hideMenu(route, hiddenList);
      function hideMenu(menus, hiddenList) {
        for (let i = 0, len = hiddenList.length; i < len; i++) {
          for (let j = 0, len2 = menus.length; j < len2; j++) {
            let menu = menus[j];
            if (menu.systemCode === hiddenList[i]) {
              menu.hidden = true;
            } else {
              if (menu.children) {
                hideMenu(menu.children, hiddenList);
              }
            }
          }
        }
      }
    }
  },
  mounted() {
    var user = sessionStorage.getItem("user");
    var token = localStorage.getItem("token");
    if (user) {
      user = JSON.parse(user);
      this.sysUserName = user.name || "";
      this.sysUserAvatar = user.avatar || "";
    }
    if (location.href.indexOf("#reloaded") == -1) {
      location.href = location.href + "#reloaded";
      location.reload();
    };
  }
};
</script>

<style scoped lang="scss">
@import "~scss_vars";

.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  .header {
    height: 60px;
    line-height: 60px;
    background: $color-primary;
    color: #fff;
    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin: 10px 0px 10px 10px;
          float: right;
        }
      }
    }
    .logo {
      //width:230px;
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: #20a0ff;
      border-right-width: 1px;
      border-right-style: solid;
      img {
        width: 80%;
        // float: left;
        // margin: 10px 10px 10px 18px;
        transform: scale(1) !important;
      }
      .txt {
        color: #fff;
      }
    }
    .logo-width {
      width: 230px;
    }
    .logo-collapse-width {
      width: 60px;
    }
    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }
  .main {
    display: flex;
    // background: #324057;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    aside {
      flex: 0 0 240px;
      width: 240px;
      // position: absolute;
      // top: 0px;
      // bottom: 0px;
      .el-menu {
        height: 100%;
      }
      .collapsed {
        width: 60px;
        .item {
          position: relative;
        }
        .submenu {
          position: absolute;
          top: 0px;
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
        }
      }
    }
    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }
    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;
    }
    .content-container {
      // background: #f1f2f7;
      flex: 1;
      // position: absolute;
      // right: 0px;
      // top: 0px;
      // bottom: 0px;
      // left: 230px;
      overflow-y: scroll;
      padding: 20px;
      .breadcrumb-container {
        //margin-bottom: 15px;
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}
</style>