<template>
  <section>
    <el-button type="text" @click="open">添加业态</el-button>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :before-close="close"
    >
      <el-form
        :model="createForm"
        label-width="150px"
        :rules="editFormRules"
        ref="createForm"
        style="width:400px"
        label-position="left"
      >
        <el-form-item prop="bizFormatNumber" label="业态编码">
          <el-input v-model="createForm.bizFormatNumber" placeholder="例：A0001"></el-input>
        </el-form-item>
        <el-form-item prop="bizFormatType" label="业态名称">
          <el-input v-model="createForm.bizFormatType" placeholder="例：餐饮"></el-input>
        </el-form-item>
        <el-form-item prop="sortNumber" label="业态类型">
          <el-select v-model="createForm.sortNumber">
            <el-option
              v-for="item in items"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="bizFormatPid" label="业态序号">
          <el-input v-model.number="createForm.bizFormatPid"></el-input>
        </el-form-item>
        <el-form-item prop="shopAreaColor" label="区域颜色">
          <el-color-picker v-model="createForm.shopAreaColor"></el-color-picker>
        </el-form-item>
        <el-form-item prop="shopTxtColor" label="区域字体颜色">
          <el-color-picker v-model="createForm.shopTxtColor"></el-color-picker>
        </el-form-item>
        <el-form-item>
          <!-- <template slot-scope="scope">    -->
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
      <div slot="footer" class="dialog-footer"></div>
    </el-dialog>
    <!-- 列表 -->
    <el-table :data="states" style="100%" :cell-style="cell">
      <el-table-column prop="bizFormatNumber" label="业态编码" sortable></el-table-column>
      <el-table-column prop="bizFormatType" label="业态名称" sortable></el-table-column>
      <el-table-column prop="sortNumber" label="业态类型" sortable>
        <template slot-scope="scope">{{scope.row.sortNumber|filters}}</template>
      </el-table-column>
      <el-table-column prop="bizFormatPid" label="业态序号" sortable></el-table-column>
      <el-table-column label="操作">
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
import { getStatePage, removeState, addState, editState } from "../../api/api";
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("业态编号不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          callback();
        }
      }, 300);
    };
    return {
      createForm: {
        bizFormatNumber: "",
        bizFormatType: "",
        bizFormatPid: 1,
        sortNumber: 0,
        shopAreaColor: "",
        shopTxtColor: ""
      },
      newCreateForm: {
        bizFormatNumber: "",
        bizFormatType: "",
        bizFormatPid: 1,
        sortNumber: 0,
        shopAreaColor: "",
        shopTxtColor: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        edit: "编辑业态",
        create: "添加业态"
      },
      states: [],
      total: 0,
      page: 1,
      pageNum: 1,
      pageSize: 10,
      filters: {
        name: ""
      },
      editFormRules: {
        bizFormatNumber: [
          { required: true, message: "请输入业态编码", trigger: "blur" }
        ],
        bizFormatType: [
          { required: true, message: "请输入业态名称", trigger: "blur" }
        ],
        bizFormatPid: [
          { required: true, validator: checkAge, trigger: "blur" }
        ],
        sortNumber: [
          {
            type: "number",
            required: true,
            message: "请选择业态类型",
            trigger: "blur"
          }
        ],
        // shopAreaColor: [
        //   { required: true, message: "请选择区域颜色", trigger: "blur" }
        // ],
        shopTxtColor: [
          { required: true, message: "请选择字体颜色", trigger: "blur" }
        ]
      },
      items: [{ label: "餐饮", value: 1 }, { label: "非餐饮", value: 0 }]
    };
  },
  methods: {
    open() {
      this.dialogFormVisible = true;
      this.dialogStatus = "create";
    },
    close() {
      this.dialogFormVisible = false;
      this.createForm = Object.assign({}, this.newCreateForm);
    },
    getStates() {
      let para = {
        page: this.page,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      getStatePage(para)
        .then(res => {
          this.states = res.data.data.list;
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
          if (para.shopAreaColor == null) {
            para.shopAreaColor = "";
          }

          addState(para).then(res => {
            if (res.data.code == 30002) {
              if (res.data.data.indexOf("type") != -1) {
                this.$confirm("业态名称重复");
              } else {
                this.$confirm("业态编码重复");
              }
            } else {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["createForm"].resetFields();
              this.dialogFormVisible = false;
              this.getStates();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    handleSizeChange(val) {
      this.pageSize = parseInt(val);
      this.getStates();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getStates();
    },
    handleDel(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        let para = { id: row.bizFormatId };
        removeState(para).then(res => {
          if (res.data.code == 0) {
            // alert(res.data.data);
            this.$confirm(res.data.msg);
          } else {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getStates();
          }
        });
      });
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
            // this.$confirm("确认提交吗？", "提示", {}).then(() => {
            let para = Object.assign({}, this.createForm);

            if (para.shopAreaColor == null) {
              para.shopAreaColor = "";
            }
            editState(para).then(res => {
              if (res.data.code == 30002) {
                if (res.data.data.indexOf("type") != -1) {
                  this.$confirm("业态名称重复");
                } else {
                  this.$confirm("业态编码重复");
                }
              } else {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["createForm"].resetFields();
                this.createForm = Object.assign({}, this.newCreateForm);
                this.dialogFormVisible = false;
                this.getStates();
              }
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
      // this.$refs[createForm].resetFields();
      this.createForm = Object.assign({}, this.newCreateForm);
    },
    cell({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return { background: row.shopAreaColor, color: row.shopTxtColor };
      }
    }
  },
  filters: {
    filters(data) {
      if (Number(data) == 1) {
        return "餐饮";
      } else {
        return "非餐饮";
      }
    }
  },
  mounted() {
    this.getStates();
  }
};
</script>
<style>
</style>


