<template>
	<section>
		<el-button type="text" @click="open">添加楼层</el-button>
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :before-close="close">
			<el-form :model="createForm" label-width="100px" :rules="editFormRules" ref="createForm" style="width:300px">
				<el-form-item  prop="floorNumber"  label="楼层">
					<el-input v-model="createForm.floorNumber"  placeholder="例：F1" >
             <!-- <template slot-scope="scope"> -->
               {{createForm.floorNumber | capitalize }}
             <!-- </template> -->
          </el-input>
				</el-form-item>
        <el-form-item  prop="floorName"  label="楼层名称">
					<el-input v-model="createForm.floorName" placeholder="例：01"></el-input>
				</el-form-item>
        <el-form-item prop="sortNumber" label="楼层序号">
          <el-input v-model.number="createForm.sortNumber" ></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <template slot-scope="scope"> -->
            <el-button v-if="dialogStatus=='create'" type="primary" @click="createData('createForm')">添加</el-button>
            <el-button v-else type="primary" @click="updateData('createForm')">修改</el-button>
            <el-button @click.native="resetForm('createForm')">取消</el-button>
          <!-- </template> -->
        </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			</div>
		</el-dialog>
		<!-- 列表 -->
		<el-table :data = 'floors'  style="100%">
			<el-table-column prop="floorNumber" label="楼层" width="300px" sortable>
			</el-table-column>
			<el-table-column prop="floorName" label="楼层名称" width="300px" sortable>
			</el-table-column>
      <el-table-column prop="sortNumber" label="楼层序号" sortable></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[10, 20, 30, 40]" :page-size='pageSize' layout="total, sizes, prev, pager, next, jumper" :total="total">
    	</el-pagination>
		</el-col>
	</section>
</template>
<script>
import { getFloorPage, removeFloor, addFloor, editFloor } from "../../api/api";
export default {
  data() {
    return {
      createForm: {
        floorName: "",
        floorNumber: "",
        sortNumber: 1
      },
      newCreateForm: {
        floorName: "",
        floorNumber: "",
        sortNumber: 1
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        edit: "编辑楼层",
        create: "添加楼层"
      },
      floors: [],
      total: 0,
      page: 1,
      pageSize: 10,
      pageNum: 1,
      filters: {
        name: ""
      },
      editFormRules: {
        floorName: [{ required: true, message: "请输入楼层", trigger: "blur" }],
        floorNumber: [
          { required: true, message: "请输入楼层名称", trigger: "blur" }
        ],
        sortNumber: [
          { required: true, message: "楼层序号不能为空" },
          { type: "number", message: "楼层序号必须为数字值" }
        ]
      }
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
    getFloors() {
      let para = {
        page: this.page,
        name: this.filters.name,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      getFloorPage(para)
        .then(res => {
          this.floors = res.data.data.list;
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
          // this.$confirm("确认提交吗？", "提示", {}).then(() => {
          let para = Object.assign({}, this.createForm);
          addFloor(para).then(res => {
            if (res.data.code == 30002) {
              if (res.data.data.indexOf("name") != -1) {
                this.$confirm("楼层名称重复");
              } else {
                this.$confirm("楼层重复");
              }
            } else {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["createForm"].resetFields();
              this.createForm = Object.assign({}, this.newCreateForm);
              this.dialogFormVisible = false;
              this.getFloors();
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
      this.getFloors();
    },
    handleCurrentChange(val) {
      this.pageNum = parseInt(val);
      this.getFloors();
    },
    handleDel(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        let para = { id: row.floorId };
        removeFloor(para).then(res => {
          if (res.data.code == 30002) {
            this.$confirm("楼层数据已经被使用，无法删除");
          } else {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getFloors();
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
            let para = Object.assign({}, this.createForm);
            editFloor(para).then(res => {
              if (res.data.code == 30002) {
                if (res.data.data.indexOf("name") != -1) {
                  this.$confirm("楼层名称重复");
                } else {
                  this.$confirm("楼层重复");
                }
              } else {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["createForm"].resetFields();
                this.createForm = Object.assign({}, this.newCreateForm);
                this.dialogFormVisible = false;
                this.getFloors();
              }
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(createForm) {
      this.dialogFormVisible = false;
      this.createForm = Object.assign({}, this.newCreateForm);
    }
  },
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  mounted() {
    this.getFloors();
  }
};
</script>
<style>
</style>


