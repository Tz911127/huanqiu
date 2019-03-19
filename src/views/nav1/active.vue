<template>
  <section>
    <el-button type="text" @click="open">添加活动</el-button>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :before-close="close"
    >
      <el-form
        :model="createForm"
        label-width="80px"
        :rules="editFormRules"
        ref="createForm"
        style="width:300px"
      >
        <el-form-item prop="activityType" label="活动类型">
          <el-input v-model="createForm.activityType" placeholder="例：品牌活动"></el-input>
        </el-form-item>
        <el-form-item prop="activityLogo" label="活动LOGO">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            :action="src"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <!-- <template slot-scope="scope"> -->
            <el-button
              v-if="dialogStatus=='create'"
              type="primary"
              @click="createData('createForm')"
            >添加</el-button>
            <el-button v-else type="primary" @click="updateData('createForm')">修改</el-button>
            <el-button @click.native="resetForm('createForm')">取消</el-button>
          <!-- </template> -->
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 列表 -->
    <el-table :data="actives"  style="100%">
      <el-table-column prop="activityLogo" label="活动LOGO" width="300px">
        <template slot-scope="scope">
          <img :src="scope.row.activityLogo" width="40" height="40" class="head_pic">
        </template>
      </el-table-column>
      <el-table-column prop="activityType" label="活动类型" width="300px" sortable></el-table-column>
      <el-table-column label="操作" min-width="300px">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
  getActivePage,
  removeActive,
  addActive,
  editActive,
  ip
} from "../../api/api";
export default {
  data() {
    return {
      createForm: {
        activityLogo: "",
        activityLogoSize: null,
        activityNumber: null,
        activityType: ""
      },
      newCreateForm: {
        activityLogo: "",
        activityLogoSize: null,
        activityNumber: null,
        activityType: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        edit: "编辑活动",
        create: "添加活动"
      },
      actives: [],
      total: 0,
      page: 1,
      pageNum: 1,
      pageSize: 10,
      filters: {
        type: ""
      },
      imageUrl: "",
      editFormRules: {
        activityType: [
          { required: true, message: "请输入活动类型", trigger: "blur" }
        ],
        activityLogo: [
          { required: true, message: "请上传图片", trigger: "change" }
        ]
      },
      fileList: [],
      src:ip() + "/activity/logo"
    };
  },
  methods: {
    open() {
      this.dialogFormVisible = true;
      this.dialogStatus = "create";
    },
    close() {
      this.dialogFormVisible = false;
      this.$refs.upload.clearFiles();
      this.createForm = Object.assign({}, this.newCreateForm);
      this.imageUrl = "";
    },
    getActives() {
      let para = {
        token: this.token,
        page: this.page,
        type: this.filters.type,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      getActivePage(para)
        .then(res => {
          this.actives = res.data.data.list;
          this.total = res.data.data.total;
        })
        .catch(error => {
          if (error) {
            this.$router.push("/login");
          }
        });
    },
    createData(createForm) {
      this.$refs[createForm].validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.createForm);
          addActive(para).then(res => {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.createForm = Object.assign({}, this.newCreateForm);
            this.$refs.upload.clearFiles();
            this.imageUrl = "";
            this.dialogFormVisible = false;
            this.getActives();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    updateData(createForm) {
      this.$refs[createForm].validate(valid => {
        if (valid) {
          this.$refs.createForm.validate(valid => {
            // this.$confirm("确定提交？", "提示", {}).then(() => {
            let para = Object.assign({}, this.createForm);
            editActive(para).then(res => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              // this.$refs["createForm"].resetFields();
              this.createForm = Object.assign({}, this.newCreateForm);
              this.imageUrl = "";
              this.dialogFormVisible = false;
              this.getActives();
            });
            // });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(createForm) {
      this.dialogFormVisible = false;
      // this.$refs.upload.clearFiles();
      // this.$refs[createForm].resetFields();
      this.imageUrl = "";
      this.createForm = Object.assign({}, this.newCreateForm);
    },
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.dialogStatus = "edit";
      this.createForm = Object.assign({}, row);
      this.imageUrl = row.activityLogo;
    },
    handleDel(index, row) {
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      }).then(() => {
        let para = { id: row.activityId };
        removeActive(para).then(res => {
          if (res.data.code == 0) {
            this.$confirm(res.data.msg);
          } else {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getActives();
          }
        });
      });
    },
    handleSizeChange(val) {
      this.pageSize = parseInt(val);
      this.getActives();
    },

    handleCurrentChange(val) {
      this.pageNum = parseInt(val);
      this.getActives();
    },
    handleAvatarSuccess(res, file) {
      this.createForm.activityLogo = res.data.filePath;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {}
  },
  mounted() {
    this.getActives();
  }
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  /* width: 178px;
  height: 178px; */
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>


