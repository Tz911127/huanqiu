<template>
  <section>
    <el-button type="text" @click="open">添加角色</el-button>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" :before-close="close">
      <el-form
        :model="createForm"
        :rules="rules"
        label-width="100px"
        ref="createForm"
        style="width:500px"
      >
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="createForm.roleName"></el-input>
        </el-form-item>
        <el-form-item prop="roleNote" label="角色说明">
          <el-input v-model="createForm.roleNote"></el-input>
        </el-form-item>
        <el-form-item prop="authIdList">
          <el-button v-model="createForm.authIdList" type="primary" @click="authority">选择权限</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="dialogStatus=='create'"
            type="primary"
            @click="createRole('createForm')"
          >确 定</el-button>
          <el-button v-else type="primary" @click="editRole('createForm')">修 改</el-button>
          <el-button @click.native="resetForm('createForm')">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="权限设置" :visible.sync="dialogAuth">
      <!-- createForm.authIdList -->
      <el-tree
        :data="treeData"
        show-checkbox
        node-key="id"
        ref="tree"
        :props="defaultProps"
        :default-checked-keys="createForm.authIdList"
        style="border:none;max-height:300px;overflow:auto"
      ></el-tree>
      <div class="buttons">
        <el-button type="primary" @click="getCheckedNodes">确 定</el-button>
        <!-- <el-button type="primary" @click="getHalfCheckedKeys">确 定</el-button> -->
        <el-button @click="dialogAuth = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-table :data="roleData">
      <el-table-column label="角色名称" prop="roleName" sortable></el-table-column>
      <el-table-column label="说明" prop="roleNote" sortable></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdt(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" @click="checkRole(scope.$index, scope.row)">查看权限</el-button>
          <el-button size="small" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="查看权限" :visible.sync="dialogRole">
      <el-tree :data="checkTree"></el-tree>
    </el-dialog>
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
  auth,
  rolePost,
  roleGet,
  roleDel,
  rolePage,
  roleAuthRole,
  roleEdit,
  authUser,
  authRole
} from "../../api/api";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogAuth: false,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      createForm: {
        roleName: "",
        roleNote: "",
        authIdList: []
      },
      newCreateForm: {
        roleName: "",
        roleNote: "",
        authIdList: []
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      },
      pageSize: 10,
      total: 0,
      pageNum: 1,
      roleData: [],
      dialogStatus: "",
      textMap: {
        updata: "编辑角色",
        create: "添加角色"
      },
      dialogRole: false,
      checkTree: []
    };
  },
  methods: {
    open() {
      this.dialogVisible = true;
      this.dialogStatus = "create";
    },
    getRole() {
      let para = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      rolePage(para).then(res => {
        this.roleData = res.data.data.list;
        this.total = res.data.data.total;
      });
    },
    close() {
      this.dialogVisible = false;
      this.$refs["createForm"].resetFields();
      this.createForm = Object.assign({}, this.newCreateForm);
    },
    resetForm(createForm) {
      this.$refs[createForm].resetFields();
      this.dialogVisible = false;
      this.createForm = Object.assign({}, this.newCreateForm);
    },
    authority() {
      auth().then(res => {
        this.treeData = res.data.data;
      });
      this.dialogAuth = true;
    },
    getCheckedNodes() {
      let tree = this.$refs.tree.getCheckedNodes();
      let pTree = this.$refs.tree.getHalfCheckedKeys();
      this.createForm.authIdList = [];
      for(let i =0;i<pTree.length;i++){
        this.createForm.authIdList.push(pTree[i])
      };
      for (let i = 0; i < tree.length; i++) {
        this.createForm.authIdList.push(tree[i].id);
      }
      this.dialogAuth = false;
      this.$refs.tree.setCheckedKeys([]);
    },

    createRole(createForm) {
      this.$refs[createForm].validate(valid => {
        if (valid) {
          rolePost(this.createForm).then(res => {
            if (res.data.code === 30002) {
              this.$confirm("角色名称重复");
            } else {
              this.$refs["createForm"].resetFields();
              this.dialogVisible = false;
              this.getRole();
            }
          });
        }
      });
    },
    editRole(createForm) {
      this.$refs[createForm].validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.createForm);
          roleEdit(para).then(res => {
            if (res.data.code === 30002) {
              this.$confirm("角色名称重复");
            } else {
              this.$refs["createForm"].resetFields();
              this.dialogVisible = false;
              this.getRole();
            }
          });
        } else {
          return false;
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = parseInt(val);
      this.getRole();
    },
    handleCurrentChange(val) {
      this.pageNum = parseInt(val);
      this.getRole();
    },
    handleEdt(index, row) {
      this.dialogVisible = true;
      this.dialogStatus = "updata";
      this.createForm = Object.assign({}, row);
      let param = { roleId: this.createForm.roleId };
      roleAuthRole(param).then(res => {
        this.createForm.authIdList = res.data.data.checkedIdList;
      });
    },
    handleDel(idnex, row) {
      this.$confirm("确定要删除吗？", "提示", { type: "warning" })
        .then(() => {
          let para = { roleId: row.roleId };
          roleDel(para).then(res => {
            if (res.data.code == 1) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getRole();
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        })
        .catch(() => {});
    },
    checkRole(index, row) {
      this.dialogRole = true;
      this.createForm = Object.assign({}, row);
      let param = { roleId: this.createForm.roleId };
      authRole(param).then(res => {
        this.checkTree = res.data.data;
      });
    }
  },
  mounted() {
    this.getRole();
  }
};
</script>
<style>
.buttons {
  text-align: center;
}
</style>

