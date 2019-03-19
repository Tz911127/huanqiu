<template>
  <section>
    <el-button type="text" @click="open">添加终端</el-button>
    <!-- 过滤 -->
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-select v-model="stateType" clearable placeholder="终端类型" @change="selectType">
          <el-option
            v-for="item in items"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select placeholder="状态" clearable @change="selectShopEnabled" v-model="slectedTypes">
          <el-option
            v-for="type in types"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select placeholder="楼层" v-model="floorNum" clearable @change="selectFloor">
          <el-option
            v-for="option in options"
            :key="option.floorId"
            :label="option.floorName"
            :value="option.floorId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" v-on:click="getData">查询</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-input clearable v-model="filters.findName" placeholder="终端名称"></el-input>
      </el-form-item>
    </el-form>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :before-close="close"
    >
      <el-form
        :model="createForm"
        :rules="rules"
        ref="createForm"
        label-width="100px"
        class="demo-ruleForm"
        style="width:300px"
      >
        <el-form-item label="终端编号" prop="terminalNumber">
          <el-input v-model="createForm.terminalNumber"></el-input>
        </el-form-item>
        <el-form-item label="终端名称" prop="terminalName">
          <el-input v-model="createForm.terminalName"></el-input>
        </el-form-item>
        <el-form-item label="终端类型" prop="terminalType">
          <el-select v-model="createForm.terminalType" placeholder="请选择">
            <el-option label="横屏" value="2"></el-option>
            <el-option label="竖屏" value="1"></el-option>
            <el-option label="二维码" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属楼层" prop="floorId">
          <el-select v-model="createForm.floorId" aria-placeholder="请选择">
            <el-option
              v-for="option in options"
              :key="option.floorId"
              :label="option.floorName"
              :value="option.floorId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="终端位置" prop="terminalLocation">
          <el-input v-model="createForm.terminalLocation"></el-input>
        </el-form-item>
        <el-form-item label="旋转角度" prop="terminalRotationAngle">
          <el-input v-model="createForm.terminalRotationAngle"></el-input>
        </el-form-item>
        <el-form-item
          v-if="createForm.terminalType == 0 || createForm.terminalType == 2"
          label="定位终端"
        >
          <el-button type="text" @click="editorTagend">编辑终端</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="create('createForm')">立即创建</el-button>
          <el-button v-else type="primary" @click="updateData('createForm')">修改</el-button>
          <el-button @click.native="resetForm('createForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 列表 -->
    <el-table :data="tableData" style="width:100%">
      <el-table-column prop="terminalNumber" width="120px" label="终端编号" sortable></el-table-column>
      <el-table-column prop="terminalName" width="120px" label="终端名称" sortable></el-table-column>
      <el-table-column prop="terminalIp" width="130px" label="终端IP" sortable></el-table-column>
      <el-table-column prop="terminalType" width="120px" label="终端类型" sortable>
        <template slot-scope="scope">{{scope.row.terminalType | filterType}}</template>
      </el-table-column>
      <el-table-column prop="floorName" width="120px" label="终端楼层" sortable></el-table-column>
      <el-table-column v-if="false" prop="terminalLocation" width="100px" label="位置" sortable></el-table-column>
      <el-table-column
        v-if="false"
        prop="terminalRotationAngle"
        width="160px"
        label="旋转角度（度）"
        sortable
      ></el-table-column>
      <el-table-column prop="isTerminalOnline" width="100px" label="状态" sortable>
        <template slot-scope="scope">{{scope.row.isTerminalOnline | filterOnline}}</template>
      </el-table-column>
      <el-table-column label="屏保节目" min-width="100px">
        <template slot-scope="scope">
          <el-button size="small" @click="play(scope.$index,scope.row)">查看</el-button>
          <el-dialog
            :title="imgDatas.length != 0?screensaverProgramName:''"
            :visible.sync="dialogImgVisible"
          >
            <div
              v-for="(imgData,index) in imgDatas"
              :key="index"
              style="display:inline-block;margin-left:10px"
            >
              <img :src="imgData.url" width="200" height="200" class="head_pic">
            </div>
            <div v-if="imgDatas.length === 0" style="text-align:center;color:#5e7382">暂无数据</div>
          </el-dialog>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="300px">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>

          <el-dialog title="首页轮播图设置" :visible.sync="dialogPicVisible" :before-close="closePic">
            <el-checkbox-group
              v-model="createForm.checkedBoxs"
              @change="handleChecked"
              style="text-align:center"
            >
              <el-checkbox
                style="box-shadow: -2px 2px 2px #888888;margin: 10px 5px;"
                v-for="(item,index) in firstPic"
                :label="item"
                :key="index"
                name="checkedBox"
              >
                <img
                  :src="item.screensaverMaterialImgPath"
                  width="100"
                  height="100"
                  class="head_pic"
                >
              </el-checkbox>
            </el-checkbox-group>
            <div slot="footer" style="text-align: center;">
              <el-button type="primary" @click="okBtn(scope.$index,scope.row)">确认</el-button>
              <el-button @click.native="canBtn()">取消</el-button>
            </div>
          </el-dialog>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          <el-button
            size="small"
            v-if="scope.row.terminalType == 2"
            @click="editPic(scope.$index,scope.row)"
          >首页轮播图</el-button>
          <el-button
            size="small"
            v-if="scope.row.terminalType ==0"
            @click="editCode(scope.$index,scope.row)"
          >生成二维码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 工具栏 -->
    <el-col :span="24" class="toolbar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-col>
    <div id="win" @click="closeLogin">
      <div class="banner-box">
        <canvas id="qrccode-canvas"></canvas>
        <i class="el-dialog__close el-icon el-icon-close" @click="closeLogin"></i>
      </div>
    </div>
  </section>
</template>
<script>
import {
  getSerminalManagePage,
  addTerminalManagement,
  removeTerminalManage,
  editTerminaManage,
  getImg,
  getFloorPage,
  getFirst,
  addFirstPage,
  ip
} from "../../api/api";
import QRCode from "qrcode";
export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogPicVisible: false,
      dialogQrVisible: false,
      dialogStatus: "",
      textMap: {
        create: "添加终端",
        edit: "编辑终端",
        img: "屏保节目"
      },
      createForm: {
        terminalNumber: "",
        terminalName: "",
        terminalType: "",
        floorId: "",
        terminalLocation: "",
        terminalRotationAngle: 0,
        checkedBoxs: []
      },
      newCreateForm: {
        terminalNumber: "",
        terminalName: "",
        terminalType: "",
        floorId: "",
        terminalLocation: "",
        terminalRotationAngle: 0,
        checkedBoxs: []
      },
      rules: {
        terminalNumber: [
          { required: true, message: "终端编号", trigger: "blur" },
          { min: 4, max: 6, message: "长度在 4 到 6个字符", trigger: "blur" }
        ],
        terminalName: [
          { required: true, message: "终端名称", trigger: "blur" }
        ],
        terminalType: [
          { required: true, message: "选择类型", trigger: "blur" }
        ],
        floorId: [
          {
            type: "number",
            required: true,
            message: "选择楼层",
            trigger: "blur"
          }
        ]
      },
      tableData: [],
      page: 1,
      filters: {
        findName: ""
      },
      total: 0,
      pageNum: 1,
      pageSize: 10,
      imgDatas: [],
      dialogImgVisible: false,
      options: [],
      floorNum: "",
      types: [{ label: "在线", value: 1 }, { label: "离线", value: 0 }],
      stateType: "",
      items: [
        { label: "二维码", value: 0 },
        { label: "竖屏", value: 1 },
        { label: "横屏", value: 2 }
      ],
      slectedTypes: "",
      firstPic: [],
      terminalId: "",
      checked: [],
      firstPageIds: [],
      screensaverProgramName: "",
      bannerUrl: "www.baidu.com",
      canvas: "",
      ip:ip()
    };
  },
  methods: {
    open() {
      (this.dialogFormVisible = true), (this.dialogStatus = "create");
    },
    close() {
      this.createForm = Object.assign({}, this.newCreateForm);
      this.dialogFormVisible = false;
    },
    play(index, row) {
      this.dialogStatus = "img";
      this.dialogImgVisible = true;
      let para = {
        sn: row.terminalNumber
      };
      getImg(para).then(res => {
        if (res.data.data.data.length != 0) {
          this.imgDatas = res.data.data.data;
          this.screensaverProgramName = res.data.data.screensaverProgramName;
        } else {
          this.imgDatas = [];
        }
      });
    },
    getData() {
      let para = {
        page: this.page,
        terminalName: this.filters.findName,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        floorId: this.floorNum,
        isTerminalOnline: this.slectedTypes,
        terminalType: this.stateType
      };
      getSerminalManagePage(para)
        .then(res => {
          this.total = res.data.data.total;
          this.tableData = res.data.data.list;
        })
        .catch(error => {
          if (error) {
            this.$router.push("/login");
          }
        });
      getFloorPage(para).then(res => {
        this.options = res.data.data.list;
      });
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.createForm);
          addTerminalManagement(para).then(res => {
            if (res.data.code == 30002) {
              if (res.data.data.indexOf("name") != -1) {
                this.$confirm("终端名称重复");
              } else {
                this.$confirm("终端编号重复");
              }
            } else {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["createForm"].resetFields();
              this.dialogFormVisible = false;
              this.getData();
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
      // this.$refs[createForm].resetFields();
      this.createForm = Object.assign({}, this.newCreateForm);
    },
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.dialogStatus = "edit";
      this.createForm = Object.assign({}, row);
    },
    updateData(createForm) {
      this.$refs[createForm].validate(valid => {
        if (valid) {
          this.$refs.createForm.validate(valid => {
            let para = Object.assign({}, this.createForm);
            editTerminaManage(para).then(res => {
              if (res.data.code == 30002) {
                // this.$confirm("终端名称重复");
                if (res.data.data.indexOf("name") != -1) {
                  this.$confirm("终端名称重复");
                } else {
                  this.$confirm("终端编号重复");
                }
              } else {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.createForm = Object.assign({}, this.newCreateForm);
                this.dialogFormVisible = false;
                this.getData();
              }
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleDel(index, row) {
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      }).then(() => {
        let para = { id: row.terminalId };
        removeTerminalManage(para).then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getData();
        });
      });
    },
    handleSizeChange(val) {
      this.pageSize = parseInt(val);
      this.getData();
    },
    handleCurrentChange(val) {
      this.pageNum = parseInt(val);
      this.getData();
    },
    selectFloor() {
      this.floorId = this.floorNum;
      this.getData();
    },
    selectType() {
      this.getData();
    },
    selectShopEnabled() {
      this.getData();
    },
    editPic(index, row) {
      // if (row.terminalType == 2) {
      this.terminalId = row.terminalId;
      this.dialogPicVisible = true;
      let para = {
        terminalId: row.terminalId
      };
      getFirst(para).then(res => {
        this.firstPic = res.data.data.list;
        for (let i = 0; i < this.firstPic.length; i++) {
          if (this.firstPic[i].checked == 1) {
            this.createForm.checkedBoxs.push(res.data.data.list[i]);
          }
        }
      });
    },
    closePic() {
      this.dialogPicVisible = false;
      this.createForm.checkedBoxs = [];
    },
    handleChecked(val) {
      this.checked = val;
    },
    okBtn(index, row) {
      let para = {};
      para.firstPageIds = [];
      para.terminalId = this.terminalId;
      for (let i = 0; i < this.createForm.checkedBoxs.length; i++) {
        para.firstPageIds.push(
          this.createForm.checkedBoxs[i].screensaverMaterialId
        );
      }
      if (para.firstPageIds.length != 0) {
        addFirstPage(para).then(res => {
          this.$message({
            message: "下发成功",
            type: "success"
          });
          this.dialogPicVisible = false;
          this.terminalId = [];
          para.firstPageIds = [];
          this.createForm.checkedBoxs = [];
          this.getData();
        });
      } else {
        this.$confirm("首页轮播图不能为空");
      }
    },
    canBtn() {
      this.dialogPicVisible = false;
      this.createForm.checkedBoxs = [];
    },
    editCode(index, row) {
      this.dialogQrVisible = true;
      document.getElementById("win").style.display = "block";
      // http://127.0.0.1:9000
      this.bannerUrl = this.ip+
        "/world-project/nav-customer-phone.html?angle=" +
        row.terminalRotationAngle +
        "&start=" +
        row.terminalNumber +
        "&startfloor=" +
        row.floorId;
      // if (!this.bannerUrl) {
      //   window.alert("链接不能为空");
      //   return false;
      // }
      QRCode.toCanvas(this.canvas, this.bannerUrl, error => {
        if (error) {
          console.log(error);
        } else {
          console.log("success");
        }
      });
    },
    closeLogin() {
      document.getElementById("win").style.display = "none";
    },
    editorTagend() {
      window.open(
        this.ip+"/home.html#/editorTagend?start="+
        // "/harbor/device/#/editorTagend?start=" +
          this.createForm.terminalNumber +
          "&" +
          "startfloor=" +
          this.createForm.floorId,
        "_blank"
      );
    }
  },
  filters: {
    filterOnline(data) {
      if (Number(data) == 0) {
        return "离线";
      } else {
        return "在线";
      }
    },
    filterType(data) {
      if (Number(data) == 0) {
        return "二维码";
      } else if (Number(data) == 1) {
        return "竖屏";
      } else {
        return "横屏";
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      // DOM操作
      this.canvas = document.getElementById("qrccode-canvas");
    });
    this.getData();
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
  height: 260px;
}
#win {
  z-index: 2018;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  position: fixed;
  overflow: auto;
  margin: 0;
  display: none;
  /* background: #333 */
}
.banner-box {
  /* width: 300px;
  height: 300px; */
  text-align: center;
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  /* background: #333; */
}
.banner-box i {
  cursor: pointer;
  color: #bfcbd9;
  position: absolute;
  top: 0;
  right: 0;
}
#qrccode-canvas {
  height: 300px !important;
  width: 300px !important;
}
</style>

