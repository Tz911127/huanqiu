<template>
  <section>
    <el-button type="text" @click="open">上传素材</el-button>
    <el-dialog title="上传素材" :visible.sync="dialogFormVisible" :before-close="close">
      <el-form :model="createForm" ref="createForm">
        <el-form-item>
          <!-- :show-file-list = false -->
          <el-upload
            ref="upload"
            class="upload-demo"
            style="display:inline-block"
            :action="src"
            :on-success="handleChange"
            list-type="picture"
            :limit="3"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            multiple
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
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

    <el-table :data="tableData" style="100%">
      <el-table-column label="素材" prop="screensaverMaterialImgPath" sortable>
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
      <el-table-column label="素材名称" prop="screensaverMaterialName" sortable></el-table-column>
      <el-table-column label="素材类型" prop="screensaverMaterialType" sortable>
        <template slot-scope="scope">{{scope.row.screensaverMaterialType | filterType}}</template>
      </el-table-column>
      <el-table-column prop="timeValue" label="素材有效期" width="300px" sortable>
        <template slot-scope="scope">
          <div>
            <span 
              @click="dbchange(scope.$index, scope.row)"
            >{{(scope.row.activeTime !="1970-01-01"&&scope.row.invalidTime !="2050-01-01")?(scope.row.activeTime+"至"+scope.row.invalidTime):"不限"}}</span>
        
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
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

    <!-- 工具 -->
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
  getFirst,
  addScreenMaterial,
  removeScreenpage,
  ip,
  editfirstPic
} from "../../api/api";
export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      dialogFormVisible: false,
      dialogStatus: "",
      ImgPath: "",
      pageSize: 10,
      total: 0,
      filters: {},
      createForm: {},
      pics: [],
      screensArr: [],
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
      this.dialogFormVisible = false;
      this.$refs.upload.clearFiles();
    },
    getData() {
      let para = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      getFirst(para)
        .then(res => {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        })
        .catch(error => {
          if (error) {
            this.$router.push("/login");
          }
        });
    },
    select(index, row) {
      this.ImgPath = row.screensaverMaterialImgPath;
      this.dialogVisible = true;
    },
    handleSizeChange(val) {
      this.pageSize = parseInt(val);
      this.getData();
    },
    handleCurrentChange(val) {
      this.pageNum = parseInt(val);
      this.getData();
    },
    handleChange(response, file, fileList) {
      this.pics = fileList;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handleRemove(file, fileList) {
      this.pics = fileList;
      // return this.$confirm(`确定移除 ${ file.name }？`);
    },
    resetForm() {
      this.dialogFormVisible = false;
      this.$refs.upload.clearFiles();
    },
    createData() {
      for (let i = 0; i < this.pics.length; i++) {
        let screens = {};
        screens.isFirstPage = 1;
        screens.screensaverMaterialImgName = this.pics[
          i
        ].response.data.fileNewName;
        screens.screensaverMaterialImgPath = this.pics[
          i
        ].response.data.filePath;
        screens.screensaverMaterialName = this.pics[
          i
        ].response.data.fileOriginName;
        screens.screensaverMaterialSize = this.pics[i].response.data.fileSize;
        screens.screensaverMaterialType = this.pics[
          i
        ].response.data.imageOrientation;
        this.screensArr.push(screens);
      }
      if (this.screensArr.length == 0) {
        this.$confirm(`请上传图片`);
      } else {
        let para = Object.assign([], this.screensArr);
        addScreenMaterial(para).then(res => {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.$refs.upload.clearFiles();
          this.dialogFormVisible = false;
          this.screensArr = [];
          this.getData();
        });
      }
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
          this.getData();
        });
      });
    },
    changeDate(val) {
      this.dateChange = val;
    },
    dbchange(index, row) {
      this.dateChange = "";
      this.dialogEdit = true;
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
      editfirstPic(para).then(res => {
        this.$message({
          message: "提交成功",
          type: "success"
        });
        this.dialogEdit = false;
        this.timeValue = "";
        this.getData();
      });
    }
    // }
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
    this.getData();
  }
};
</script>
