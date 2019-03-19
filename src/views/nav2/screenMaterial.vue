<template>
  <section>
    <el-button type="text" @click="open">上传素材</el-button>

    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-select v-model="filters.type" clearable placeholder="素材类型" @change="getScreen">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="getScreen">查询</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-input v-model="filters.name" placeholder="素材名称"></el-input>
      </el-form-item>
    </el-form>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :before-close="close"
    >
      <!-- :show-file-list = false -->
      <el-form :model="createForm" ref="createForm">
        <el-form-item>
          <el-upload
            ref="upload"
            class="upload-demo"
            style="display:inline-block"
            :action="src"
            :on-success="handleChange"
            :file-list="fileList"
            :show-file-list="false"
            multiple
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-table :data="imgData" highlight-current-row style="100%">
            <el-table-column prop="fileOriginName" label="文件名称" sortable width="150px"></el-table-column>
            <!-- <el-table-column prop="fileTime" label="素材有效期" sortable width="300px">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.timeValue"
                  type="daterange"
                  range-separator="至"
                  placeholder="选择有效日期"
                ></el-date-picker>
              </template>
            </el-table-column>-->
            <el-table-column prop="fileSize" label="文件大小" sortable width="150px"></el-table-column>
            <el-table-column label="操作" min-width="120px">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  size="small"
                  @click.native.prevent="deleteRow(scope.$index, imgData)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item>
          <el-button
            v-if="dialogStatus=='create'"
            type="primary"
            @click="createData('createForm')"
          >确定</el-button>
          <el-button @click.native="resetForm('createForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 列表 -->
    <el-table :data="activeMaterials" style="100%">
      <el-table-column prop="logo" label="素材" width="200px">
        <template slot-scope="scope">
          <img
            :src="scope.row.screensaverMaterialImgPath"
            @click="select(scope.$index, scope.row)"
            width="40"
            height="40"
            style="cursor:pointer"
            class="head_pic"
          >
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="ImgPath">
          </el-dialog>
        </template>
      </el-table-column>
      <el-table-column prop="screensaverMaterialName" label="素材名称" width="200px" sortable></el-table-column>
      <el-table-column prop="screensaverMaterialType" label="素材类型" width="200px" sortable>
        <template slot-scope="scope">{{scope.row.screensaverMaterialType | filterType}}</template>
      </el-table-column>
      <el-table-column prop="screensaverMaterialType" label="素材有效期" width="200px" sortable>
        <template slot-scope="scope">
          <div>
            <span
              @click="dbchange(scope.$index, scope.row)"
            >{{(scope.row.activeTime !="1970-01-01"&&scope.row.invalidTime !="2050-01-01")?(scope.row.activeTime+"至"+scope.row.invalidTime):"不限"}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="300px">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogEditVisible">
            <el-form :model="createForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="素材名称" prop="screensaverMaterialName">
                <el-input v-model="createForm.screensaverMaterialName"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateData('createForm')">确定</el-button>
                <el-button @click.native="dialogEditVisible=false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogEdit" title="编辑有效期">
      <el-form label-width="100px" style="width:500px">
        <el-form-item label="活动有效期">
          <el-date-picker
            v-model="timeValue"
            type="daterange"
            @change="changeDate"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getTime('createForm')">确 定</el-button>
          <el-button @click="dialogEdit = false">取 消</el-button>
        </el-form-item>
      </el-form>
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
  getScreenPage,
  removeScreenpage,
  addScreenMaterial,
  editScreen,
  ip
} from "../../api/api";
export default {
  data() {
    return {
      createForm: {},
      dialogFormVisible: false,
      dialogEditVisible: false,
      dialogStatus: "",
      textMap: {
        updata: "修改素材",
        create: "上传素材"
      },
      activeMaterials: [],
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
      items: [],
      operation: "",
      value: "",
      page: 1,
      pageNum: 1,
      pageSize: 10,
      filters: {
        type: "",
        name: ""
      },
      total: 0,
      fileList: [],
      dialogVisible: false,
      imgData: [],
      screensArr: [],
      showImg: false,
      ImgPath: "",
      timeValue: "",
      src: ip() + "/screensaverMaterial/picture",
      dialogEdit: false,
      dateChange: ""
    };
  },
  methods: {
    open() {
      (this.dialogFormVisible = true), (this.dialogStatus = "create");
    },
    close() {
      this.imgData = [];
      this.$refs.upload.clearFiles();
      this.dialogFormVisible = false;
    },
    getScreen() {
      let para = {
        page: this.page,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        screensaverMaterialType: this.filters.type,
        screensaverMaterialName: this.filters.name
      };
      getScreenPage(para)
        .then(res => {
          this.activeMaterials = res.data.data.list;
          this.total = res.data.data.total;
        })
        .catch(error => {
          if (error) {
            this.$router.push("/login");
          }
        });
    },
    handleCurrentChange(val) {
      this.pageNum = parseInt(val);
      this.getScreen();
    },
    handleSizeChange(val) {
      this.pageSize = parseInt(val);
      this.getScreen();
    },
    handleDel(index, row) {
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      }).then(() => {
        let para = { id: row.screensaverMaterialId };
        removeScreenpage(para).then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getScreen();
        });
      });
    },
    handleEdit(index, row) {
      this.dialogEditVisible = true;
      this.dialogStatus = "updata";
      this.createForm = Object.assign({}, row);
    },
    handleChange(response, file, fileList) {
      this.imgData.push(response.data);
    },
    createData(createForm) {
      if (this.imgData.length == 0) {
        this.$confirm(`请上传图片`);
      } else {
        this.$refs[createForm].validate(valid => {
          if (valid) {
            // this.$confirm("确认提交吗？", "提示", {}).then(() => {

            for (let i = 0; i < this.imgData.length; i++) {
              let screens = {};
              screens.screensaverMaterialImgName = this.imgData[i].fileNewName;
              screens.screensaverMaterialImgPath = this.imgData[i].filePath;
              screens.screensaverMaterialName = this.imgData[i].fileOriginName;
              screens.screensaverMaterialSize = this.imgData[i].fileSize;
              screens.screensaverMaterialType = this.imgData[
                i
              ].imageOrientation;
              this.screensArr.push(screens);
            }
            let para = Object.assign([], this.screensArr);
            addScreenMaterial(para).then(res => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["createForm"].resetFields();
              this.imgData = [];
              this.screensArr = [];
              this.$refs.upload.clearFiles();
              this.dialogFormVisible = false;
              this.getScreen();
            });
            // });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    updateData(createForm) {
      let para = Object.assign({}, this.createForm);
      editScreen(para).then(res => {
        this.$message({
          message: "提交成功",
          type: "success"
        });
        // this.$refs["createForm"].resetFields();
        this.dialogEditVisible = false;
        this.getScreen();
      });
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
      // this.$refs.upload.clearFiles();
    },
    select(index, row) {
      this.ImgPath = row.screensaverMaterialImgPath;
      this.dialogVisible = true;
    },
    resetForm(createForm) {
      this.imgData = [];
      this.$refs.upload.clearFiles();
      this.dialogFormVisible = false;
      //  this.createForm = Object.assign({},this.newCreateForm)
    },
    changeDate(val) {
      this.dateChange = val;
    },
    dbchange(index, row) {
      this.dialogEdit = true;
      this.dateChange = "";
      this.createForm = Object.assign({}, row);
      if (this.createForm.activeTime) {
        this.timeValue = [
          this.createForm.activeTime,
          this.createForm.invalidTime
        ];
      } else {
        this.timeValue = ["", ""];
      }
    },
    getTime(createForm) {
      // if (this.timeValue == "") {
      //   this.$confirm("请编辑有效期", "提示", { type: "warning" });
      // } else {
      let para = Object.assign({}, this.createForm);
      let val = this.dateChange;
      if (val) {
        let activeTime = val[0];
        let invalidTime = val[1];
        para["activeTime"] = activeTime;
        para["invalidTime"] = invalidTime;
      } else if (this.dateChange === null) {
        para["activeTime"] = "";
        para["invalidTime"] = "";
      } else {
        para["activeTime"] = para.activeTime;
        para["invalidTime"] = para.invalidTime;
      }
      editScreen(para).then(res => {
        this.$message({
          message: "提交成功",
          type: "success"
        });
        this.dialogEdit = false;
        this.timeValue = "";
        this.getScreen();
      });
      // }
    }
  },
  filters: {
    filterType(data) {
      if (Number(data) == 1) {
        return "竖屏";
      } else {
        return "横屏";
      }
    }
  },
  mounted() {
    this.getScreen();
  }
};
</script>
