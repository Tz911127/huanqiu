<template>
  <section>
    <el-button type="text" @click="open">添加屏保</el-button>
    <el-form :inline="true" style="float:right" :model="filters">
      <el-form-item>
        <el-input placeholder="屏保名称" v-model="filters.findName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="getScreen">查询</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :before-close="close"
    >
      <el-form
        :inline="true"
        :model="createForm"
        ref="createForm"
        :rules="rules"
        class="demo-form-inline"
      >
        <el-form-item label="屏保名称" prop="screensaverProgramName" style="margin-right:1px">
          <el-input v-model="createForm.screensaverProgramName" placeholder="屏保名称"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" prop="type">
          <el-select v-model="createForm.type" placeholder="素材类型" @change="getScreen">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="dialogStatus=='create'"
            type="primary"
            @click="createData('createForm')"
          >确定</el-button>
          <el-button v-else type="primary" @click="updateData('createForm')">修改</el-button>
          <el-button type="primary" @click.native="resetForm('createForm')">取消</el-button>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" prop="checkedBox" style="display:block">
          <el-checkbox-group
            v-model="createForm.checkedBox"
            @change="handleCheckedChange"
            style="text-align:center"
          >
            <el-checkbox
              style="box-shadow: -2px 2px 2px #888888;margin: 10px 5px;"
              v-for="(item,index) in items"
              :label="item"
              :key="index"
              name="checkedBox"
            >
              <img :src="item.screensaverMaterialImgPath" width="100" height="100" class="head_pic">
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 列表 -->
    <el-table :data="shops" highlight-current-row style="width: 100%;">
      <el-table-column
        prop="screensaverProgramName"
        label="屏保节目名称"
        width="200px"
        auto-complete="off"
        sortable
      ></el-table-column>
      <el-table-column prop="screensaverMaterialAmount" label="素材数量" width="200px" sortable>
        <template slot-scope="scope">
          <div
            style="cursor:pointer"
            @click="screensNum(scope.$index, scope.row)"
          >{{ scope.row.screensaverMaterialAmount }}</div>
          <el-dialog :title="screensName" :visible.sync="dialogNum" :before-close="screenClose">
            <div
              v-for="(screensaver,index) in screensavers"
              :key="index"
              style="display:inline-block;margin-left:10px"
            >
              <img
                :src="screensaver.screensaverMaterialImgPath"
                width="200"
                height="200"
                class="head_pic"
              >
            </div>
            <!-- <div v-if="screensavers.length === 0">暂无数据</div> -->
          </el-dialog>
        </template>
      </el-table-column>
      <el-table-column prop="screensaverPublishedAmount" label="发布终端数" width="200px" sortable>
        <template slot-scope="scope">
          <div
            style="cursor:pointer"
            @click="screensPublish(scope.$index, scope.row)"
          >{{ scope.row.screensaverPublishedAmount }}</div>
          <el-dialog :title="textNum[dialogP]" :visible.sync="dialogPub">
            <el-table
              @selection-change="handleSelectionChange"
              ref="multipleTable"
              style="width: 100%"
              tooltip-effect="dark"
              :data="pubTableData"
            >
              <el-table-column prop="terminalName" width="120" label="终端名称" sortable></el-table-column>
              <el-table-column prop="terminalType" width="120" label="终端类型" sortable>
                <template slot-scope="scope">{{scope.row.terminalType | filterType}}</template>
              </el-table-column>
              <el-table-column prop="floorName" width="120" label="所属楼层" sortable></el-table-column>
              <el-table-column prop="terminalLocation" width="120" label="终端位置" sortable></el-table-column>
              <el-table-column prop="isTerminalOnline" min-width="120" label="终端状态" sortable>
                <template slot-scope="scope">{{scope.row.isTerminalOnline | filterOnline}}</template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </template>
      </el-table-column>
      <el-table-column prop="addScreensaverTime" label="创建日期" width="200px" sortable>
        <template slot-scope="scope">{{scope.row.addScreensaverTime|formatDate}}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="250px">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">另存为</el-button>
          <el-button size="small" @click="handleIssue(scope.$index, scope.row)">发布</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 发布 列表-->
    <el-dialog :title="textIssue[dialog]" :visible.sync="dialogForm" :before-close="closePub">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="楼层">
          <el-select v-model="formInline.floor" clearable placeholder="楼层" @change="selectFloor">
            <el-option
              v-for="floor in floors"
              :key="floor.floorId"
              :label="floor.floorName"
              :value="floor.floorId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="终端类型">
          <el-select v-model="formInline.type" placeholder="类型" @change="selectType">
            <el-option label="横屏" value="2"></el-option>
            <el-option label="竖屏" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-table
        :data="tableData"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
        style="width: 100%"
        tooltip-effect="dark"
      >
        <el-table-column type="selection" width="55" sortable></el-table-column>
        <el-table-column prop="terminalNumber" width="120" label="终端编号"></el-table-column>
        <el-table-column prop="terminalName" width="120" label="终端名称" sortable></el-table-column>
        <el-table-column prop="terminalType" width="120" label="终端类型" sortable>
          <template slot-scope="scope">{{scope.row.terminalType | filterType}}</template>
        </el-table-column>
        <el-table-column prop="floorName" width="120" label="所属楼层" sortable></el-table-column>
        <el-table-column prop="terminalLocation" width="120" label="终端位置" sortable></el-table-column>
        <el-table-column prop="isTerminalOnline" min-width="120" label="终端状态" sortable>
          <template slot-scope="scope">{{scope.row.isTerminalOnline | filterOnline}}</template>
        </el-table-column>
        <template slot="empty">
          <span>暂无激活终端</span>
        </template>
      </el-table>
      <!-- 工具 -->
      <el-col :span="24" class="toolbar">
        <!-- <el-pagination @size-change="pubHandleSizeChange" @current-change="pubHandleCurrentChange" :current-page="1" :page-sizes="[5, 10, 15, 20]" :page-size='pubPageSize' layout="total, sizes, prev, pager, next, jumper" :total="pubTotal">
        </el-pagination>-->
        <el-pagination layout="prev, pager, next" :total="pubTotal"></el-pagination>
      </el-col>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="issueData()">发布</el-button>
        <el-button @click.native="reset('formInline')">取消</el-button>
      </div>
    </el-dialog>

    <!-- 另存为 -->
    <el-dialog :title="textMap[dialogA]" :visible.sync="dialogAnother" :before-close="colseOther">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="素材数量" name="first">
          <el-form
            :inline="true"
            :model="createOther"
            ref="createForm"
            :rules="rules"
            class="demo-form-inline"
          >
            <el-form-item label="屏保名称" prop="screensaverProgramName" style="margin-right:1px">
              <el-input v-model="createOther.screensaverProgramName" placeholder="屏保名称"></el-input>
            </el-form-item>
            <!-- <el-form-item prop="type">
		        	    <el-select v-model="createForm.type" placeholder="素材类型" @change='getScreen'>
            		    <el-option
            				    v-for="item in options"
            				    :key="item.value"
            				    :label="item.label"
            				    :value="item.value"
		        		    >
            			</el-option>
  	          </el-select>
            </el-form-item>-->
            <el-checkbox-group
              v-model="createForm.checkedBoxs"
              @change="handleChecked"
              style="text-align:center"
            >
              <el-checkbox
                style="box-shadow: -2px 2px 2px #888888;margin: 10px 5px;"
                v-for="(item,index) in otherData"
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
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="发布终端数" name="second">
          <el-table
            @selection-change="handleSelectionChange"
            ref="multipleTable"
            style="width: 100%"
            tooltip-effect="dark"
            :data="pubTableData"
          >
            <el-table-column prop="terminalName" width="120" label="终端名称" sortable></el-table-column>
            <el-table-column prop="terminalType" width="120" label="终端类型" sortable>
              <template slot-scope="scope">{{scope.row.terminalType | filterType}}</template>
            </el-table-column>
            <el-table-column prop="floorName" width="120" label="所属楼层" sortable></el-table-column>
            <el-table-column prop="terminalLocation" width="120" label="终端位置" sortable></el-table-column>
            <el-table-column prop="isTerminalOnline" min-width="120" label="终端状态" sortable>
              <template slot-scope="scope">{{scope.row.isTerminalOnline | filterOnline}}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  size="small"
                  @click.native.prevent="deleteRow(scope.$index, pubTableData)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="otherOkData('activeName')">确认</el-button>
        <el-button @click.native="otherReset('activeName')">取消</el-button>
      </div>
    </el-dialog>

    <!--工具条-->
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
  </section>
</template>
<script>
import {
  getScreenManagementPage,
  addScreenManagement,
  removeScreenManage,
  getPublichScreen,
  getSerminalManagePage,
  getScreenPage,
  getScreenSaver,
  getPublic,
  editScreenpage,
  getScreenImg,
  getFloorPage,
  getScreenBound
} from "../../api/api";
import { formatDate } from "../../utils/common.js";
export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogStatus: "",
      dialog: "",
      dialogForm: false,
      dialogN: "",
      dialogNum: false,
      dialogP: "",
      dialogPub: false,
      dialogAnother: false,
      dialogA: "",
      shops: [],
      page: 1,
      pageNum: 1,
      pageSize: 10,
      filters: {
        findName: "",
        type: ""
      },
      total: 0,
      textMap: {
        create: "添加屏保",
        edit: "另存为"
      },
      textNum: {
        num: "素材",
        pub: "播放终端"
      },
      createForm: {
        screensaverProgramName: "",
        checkedBoxs: [],
        checkedBox: [],
        type: "2"
      },
      newCreateForm: {
        screensaverProgramName: "",
        checkedBoxs: [],
        checkedBox: [],
        type: "2"
      },
      rules: {
        screensaverProgramName: [
          { required: true, message: "请输入屏保名称", trigger: "blur" }
        ]
        // checkedBox: [{ required: true, message: "请选择屏保", trigger: "blur" }]
      },
      textIssue: {
        update: "发布"
      },
      formInline: {
        floor: "",
        type: "2"
      },
      newFormInline: {
        floor: "",
        type: "2"
      },
      tableData: [],
      newTableData: [],
      items: [],
      multipleSelection: [],
      terminalId: [],
      screensavers: [],
      pubTableData: [],
      issueId: "",

      checkedId: [],
      screensaverMaterialIds: [],
      totalScreen: 0,
      pageScreenSize: 10,
      pageScreenNum: 1,
      options: [
        {
          label: "横屏",
          value: "2"
        },
        {
          label: "竖屏",
          value: "1"
        }
      ],
      floors: [],
      pubTotal: 0,
      activeName: "first",
      other: [],
      otherData: [],
      checkedData: [],
      otherChecked: [],
      createOther: {
        screensaverProgramName: ""
      },
      screensName: "",
      checkeId: []
    };
  },
  methods: {
    open() {
      (this.dialogFormVisible = true), (this.dialogStatus = "create");
      //创建图片
      let para = {
        screensaverMaterialType: this.createForm.type
      };
      getScreenPage(para).then(res => {
        this.items = res.data.data.list;
      });
    },
    close() {
      this.createForm = Object.assign({}, this.newCreateForm);
      this.dialogFormVisible = false;
      this.screensaverMaterialIds = [];
    },
    closePub() {
      this.formInline = Object.assign({}, this.newFormInline);
      this.dialogForm = false;
    },
    colseOther() {
      this.dialogAnother = false;
      this.other = [];
      this.otherChecked = [];
      this.createForm.checkedBoxs = [];
      this.createOther.screensaverProgramName = "";
    },
    getScreen() {
      let para = {
        page: this.page,
        screensaverProgramName: this.filters.findName,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        screensaverMaterialType: this.createForm.type
      };
      getScreenManagementPage(para)
        .then(res => {
          this.shops = res.data.data.list;
          this.total = res.data.data.total;
        })
        .catch(error => {
          if (error) {
            this.$router.push("/login");
          }
        });

      getScreenPage(para).then(res => {
        this.items = res.data.data.list;
      });
    },
    handleEdit(index, row) {
      this.dialogAnother = true;

      this.dialogA = "edit";
      let para = { screensaverId: row.screensaverId };
      getSerminalManagePage(para).then(res => {
        this.pubTableData = res.data.data.list;
        this.other = this.pubTableData;
      });
      getScreenPage(para).then(res => {
        this.otherData = res.data.data.list;
        for (let i = 0; i < res.data.data.list.length; i++) {
          if (res.data.data.list[i].checked == 1) {
            this.createForm.checkedBoxs.push(res.data.data.list[i]);
          }
        }
      });
    },
    updateData(createForm) {
      // this.$refs[createForm].validate(valid => {
      //   if (valid) {
      this.$refs.createForm.validate(valid => {
        this.$confirm("确认提交吗？", "提示", {}).then(() => {
          let para = Object.assign({}, this.createForm);
          editScreenpage(para).then(res => {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.$refs["createForm"].resetFields();
            this.dialogFormVisible = false;
            this.screensaverMaterialIds = [];
            this.getScreen();
          });
        });
      });
      // } else {
      //     console.log("error submit!!");
      //     return false;
      //   }
      // });
    },
    handleIssue(index, row) {
      (this.dialogForm = true), (this.dialog = "update");
      this.issueId = row.screensaverId;

      let para = {
        screensaverId: row.screensaverId,
        terminalType: this.formInline.type
      };
      getPublic(para).then(res => {
        this.tableData = res.data.data.list;
        this.pubTotal = res.data.data.total;
      });
      getFloorPage().then(res => {
        this.floors = res.data.data.list;
      });
      let pa = {
        screensaverId: row.screensaverId
      };
      getScreenBound(pa).then(res => {
        if (res.data.data.list != 0) {
          this.formInline.type = res.data.data.list[0].screensaverMaterialType;
        }
      });
    },

    //过滤
    getfilter() {
      let para = {
        floorId: this.formInline.floor,
        terminalType: this.formInline.type
      };
      getPublic(para).then(res => {
        this.tableData = res.data.data.list;
      });
    },
    handleDel(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = { id: row.screensaverId };
          removeScreenManage(para).then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getScreen();
          });
        })
        .catch(() => {});
    },
    screensNum(index, row) {
      this.dialogNum = true;
      this.dialogN = "num";
      let para = { screensaverId: row.screensaverId };
      this.screensName = row.screensaverProgramName;
      getScreenBound(para).then(res => {
        this.screensavers = res.data.data.list;
      });
    },
    screenClose() {
      this.dialogNum = false;
      this.screensavers = [];
    },
    screensPublish(index, row) {
      this.dialogPub = true;
      this.dialogP = "pub";
      let para = { screensaverId: row.screensaverId };
      getSerminalManagePage(para).then(res => {
        this.pubTableData = res.data.data.list;
      });
    },
    handleSizeChange(val) {
      this.pageSize = parseInt(val);
      this.getScreen();
    },

    handleCurrentChange(val) {
      this.pageNum = parseInt(val);
      this.getScreen();
    },
    createData(createForm) {
      this.$refs[createForm].validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.createForm);
          let data = {};
          data.bizScreensaver = para;
          if (this.checkeId == 0) {
            this.$confirm("请选择屏保素材");
          } else {
            for (let i = 0; i < this.checkeId.length; i++) {
              this.screensaverMaterialIds.push(
                this.checkeId[i].screensaverMaterialId
              );
            }
            data.screensaverMaterialIds = this.screensaverMaterialIds;
            addScreenManagement(data).then(res => {
              if (res.data.code == 30002) {
                this.$confirm("屏保节目名称重复");
              } else {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["createForm"].resetFields();
                this.dialogFormVisible = false;
                this.screensaverMaterialIds = [];
                this.checkeId = [];
                this.getScreen();
              }
            });
          }
        }
      });
    },
    issueData() {
      let para = { terminalIds: this.terminalIds, screensaverId: this.issueId };
      getPublichScreen(para).then(res => {
        this.dialogForm = false;
        this.getScreen();
      });
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    handleSelectionChange(val) {
      let valTerminalId = [];
      for (let i = 0; i < val.length; i++) {
        valTerminalId.push(val[i].terminalId);
      }
      this.terminalIds = valTerminalId;
    },
    handleCheckedChange(val) {
      this.checkeId = val;
    },
    handleSreenSizeChange(val) {
      this.pageScreenSize = val;
      this.handleIssue();
    },
    handleScreenCurrentChange(val) {
      this.pageScreenNum = val;
      this.handleIssue();
    },
    resetForm(createForm) {
      // this.$refs[createForm].resetFields();
      this.createForm = Object.assign({}, this.newCreateForm);
      this.dialogFormVisible = false;
      this.screensaverMaterialIds = [];
    },
    selectFloor() {
      this.getfilter();
    },
    selectType() {
      this.getfilter();
    },
    reset(formInline) {
      this.formInline = Object.assign({}, this.newFormInline);
      this.dialogForm = false;
    },
    pubHandleSizeChange(val) {},
    pubHandleCurrentChange(val) {},
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
      this.other = rows;
    },
    otherOkData() {
      if (Object.assign({}, this.createOther).screensaverProgramName != "") {
        let para = {};
        para.bizScreensaver = Object.assign({}, this.createOther);
        para.screensaverMaterialIds = [];
        for (let i = 0; i < this.createForm.checkedBoxs.length; i++) {
          para.screensaverMaterialIds.push(
            this.createForm.checkedBoxs[i].screensaverMaterialId
          );
        }
        para.terminalIds = [];
        for (let i = 0; i < this.other.length; i++) {
          para.terminalIds.push(this.other[i].terminalId);
        }
        addScreenManagement(para).then(res => {
          if (res.data.code == 30002) {
            this.$confirm("屏保节目名称重复");
          } else {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.dialogAnother = false;
            this.createForm.checkedBoxs = [];
            this.otherChecked = [];
            this.createOther.screensaverProgramName = "";
            this.getScreen();
          }
        });
      } else {
        alert("请输入屏保名称");
      }
    },
    otherReset() {
      this.dialogAnother = false;
      this.other = [];
      this.otherChecked = [];
      this.createForm.checkedBoxs = [];
      this.createOther.screensaverProgramName = "";
    },
    handleChecked(val) {}
  },
  filters: {
    filterType(data) {
      if (Number(data) == 0) {
        return "二维码";
      } else if (Number(data) == 1) {
        return "竖屏";
      } else {
        return "横屏";
      }
    },
    filterOnline(data) {
      if (Number(data) == 0) {
        return "离线";
      } else {
        return "在线";
      }
    },
    formatDate(time) {
      var data = new Date(time);
      return formatDate(data, "yyyy-MM-dd");
    }
  },
  mounted() {
    this.getScreen();
  }
};
</script>

<style>
el-dialog .el-form--inline .el-form-item {
  margin-right: 2px !important;
}

.el-checkbox + .el-checkbox {
  margin-left: 0 !important;
}
</style>
