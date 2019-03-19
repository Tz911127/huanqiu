<template>
    <section>
        <el-dialog :visible="dialogQrVisible" :before-close="close">
            
        </el-dialog>
        <el-button @click="openLogin">点击</el-button>
        <el-button @click="closeLogin">取消</el-button>
        <div id="win" style="display:none; POSITION:absolute; left:50%; top:50%; width:600px; height:400px;">
            <div class="home-container">
            <div class="banner-box">
              <canvas id="qrccode-canvas"></canvas>
            </div>
            <div class="btn-wrap">
              <textarea type="textarea" v-model="bannerUrl" placeholder="输入链接"></textarea>

              <!-- <button @click="createQrc">点击生成二维码</button> -->
            </div>
             </div>
        </div>
    </section>
   
</template>
<script>
var QRCode = require("qrcode");
var canvas = "";
export default {
  data() {
    return {
      bannerUrl: "婕哥好厉害",
      dialogQrVisible: false
    };
  },
  methods: {
    open() {
      this.dialogQrVisible = true;
    },
    close() {
      this.dialogQrVisible = false;
    },
    createQrc: function() {
      if (!this.bannerUrl) {
        window.alert("链接不能为空");
        return false;
      }
      QRCode.toCanvas(canvas, this.bannerUrl, error => {
        if (error) {
          console.log(error);
        } else {
          console.log("success");
        }
      });
    },

    openLogin() {
      document.getElementById("win").style.display = "";
      if (!this.bannerUrl) {
        window.alert("链接不能为空");
        return false;
      }
      QRCode.toCanvas(canvas, this.bannerUrl, error => {
        if (error) {
          console.log(error);
        } else {
          console.log("success");
        }
      });
    },
    closeLogin() {
      document.getElementById("win").style.display = "none";
    }
  },

  mounted() {
    this.$nextTick(function() {
      // DOM操作
      canvas = document.getElementById("qrccode-canvas");
    });
  }
};
</script>
<style>
.btn-wrap {
  width: 260px;
  height: 260px;
  margin: 0 auto;
}
.btn-wrap textarea {
  width: 260px;
  height: 100px;
}
</style>

