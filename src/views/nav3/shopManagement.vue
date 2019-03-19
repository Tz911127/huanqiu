<template>
  <section>
    <!-- <el-button type="text" v-on:click="open">添加商铺</el-button> -->
    <!-- 过滤 -->
    <el-col>
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-select
            v-model="stateType"
            style="width:130px"
            clearable
            placeholder="业态类型"
            @change="selectType"
          >
            <el-option
              v-for="item in items"
              :key="item.bizFormatId"
              :label="item.bizFormatType"
              :value="item.bizFormatId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            placeholder="状态"
            style="width:130px"
            clearable
            @change="selectShopEnabled"
            v-model="sleectedShop"
          >
            <el-option
              v-for="selectShop in selectShops"
              :key="selectShop.value"
              :label="selectShop.label"
              :value="selectShop.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            placeholder="楼层"
            style="width:130px"
            v-model="floorNum"
            clearable
            @change="selectFloor"
          >
            <el-option
              v-for="option in options"
              :key="option.floorId"
              :label="option.floorName"
              :value="option.floorId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" v-on:click="getUsers">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right;width:120px">
          <el-input clearable v-model="filters.findName" placeholder="商铺名称"></el-input>
        </el-form-item>
        <el-form-item style="float:right;width:120px">
          <el-input v-model="filters.findCode" placeholder="商铺编码"></el-input>
        </el-form-item>
        <el-form-item style="float:right;width:120px">
          <el-input v-model="filters.findNum" placeholder="门牌号"></el-input>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- 创建页面 -->
    <el-dialog
      class="create"
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
        <el-form-item label="商铺编码" prop="shopNumber">
          <el-input v-model="createForm.shopNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商铺名称" prop="shopName">
          <el-input v-model="createForm.shopName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商铺英文名称" prop="shopEnglishName">
          <el-input v-model="createForm.shopEnglishName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属楼层" prop="floorId">
          <el-select type="number" v-model="createForm.floorId" aria-placeholder="请选择">
            <el-option
              v-for="option in options"
              :key="option.floorId"
              :label="option.floorName"
              :value="option.floorId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型" prop="bizFormatId">
          <el-select type="number" v-model="createForm.bizFormatId" aria-placeholder="请选择">
            <el-option
              v-for="item in items"
              :key="item.bizFormatId"
              :label="item.bizFormatType"
              :value="item.bizFormatId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门牌号" prop="shopHouseNumber">
          <el-input v-model="createForm.shopHouseNumber"></el-input>
        </el-form-item>
        <el-form-item prop="logo" label="LOGO" class="logoBefore">
          <el-upload
            ref="logo"
            class="avatar-uploader"
            :action="logoSrc"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商铺图片" prop="shoppicture" style="width:600px" class="pic">
          <el-upload
            ref="upload"
            :action="shopSrc"
            list-type="picture-card"
            :file-list="fileList"
            :on-success="handlePictureCardPreview"
            :on-remove="handleRemove"
            multiple
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="联系电话" prop="shopTel">
          <el-input v-model="createForm.shopTel"></el-input>
        </el-form-item>
        <el-form-item label="入驻日期" prop="addShopTime">
          <el-date-picker type="date" placeholder="选择日期" v-model="createForm.addShopTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="商铺介绍" prop="shopDescript">
          <el-input type="textarea" v-model="createForm.shopDescript"></el-input>
        </el-form-item>
        <el-form-item label="商铺权重" prop="shopWeight">
          <el-input v-model="createForm.shopWeight"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="dialogStatus=='create'"
            type="primary"
            @click="createData('createForm')"
          >确定</el-button>
          <el-button v-else type="primary" @click="updateData('createForm')">修改</el-button>
          <el-button @click.native="resetForm('createForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 列表 -->
    <el-table :data="shops" highlight-current-row style="width: 100%;">
      <el-table-column prop="shopNumber" label="商铺编码" width="120px" sortable></el-table-column>
      <el-table-column prop="shopName" label="商铺名称" width="120px" sortable></el-table-column>
      <el-table-column prop="floorName" label="所属楼层" width="120px" sortable></el-table-column>
      <el-table-column prop="bizFormatType" label="业态类型" width="120px" sortable></el-table-column>
      <el-table-column prop="shopHouseNumber" label="门牌号" width="120px" sortable></el-table-column>
      <el-table-column prop="shopTel" label="联系方式" width="120px" sortable></el-table-column>
      <el-table-column prop="timeValue" label="优惠有效期" width="280px" sortable>
        <template slot-scope="scope">
          <div>
            <span
              @click="dbchange(scope.$index, scope.row)"
            >{{scope.row.saleStartTime?scope.row.saleStartTime+"至"+scope.row.saleEndTime:"无优惠"}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="isShopEnabled" label="状态" width="80">
        <template slot-scope="scope">{{scope.row.isShopEnabled | filterOnline}}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        min-width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            @click="changeOnline(scope.row,scope.row.isShopEnabled)"
            type="text"
            size="small"
          >{{scope.row.isShopEnabled===0?"启用":"停用"}}</el-button>
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
        @current-change="change_num"
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
  getUserListPage,
  removeUser,
  editUser,
  addUser,
  switchStart,
  getPic,
  getBusinessFormats,
  getFloors,
  ip,
  editShopTime
} from "../../api/api";
export default {
  data() {
    return {
      dialogStatus: "",
      textMap: {
        update: "编辑商铺",
        create: "添加商铺"
      },
      dialogFormVisible: false,
      createForm: {
        shopNumber: "",
        shopName: "",
        floorId: "",
        bizFormatId: "",
        shopEnglishName: "",
        num: "",
        addShopTime: "",
        addr: "",
        shopLogoPath: "",
        isShopEnabled: "",
        shopWeight: 100,
        floorName: "",
        bizFormatType: "",
        shoppicture: "",
        logo: "",
        shopDescript: ""
      },
      newCreateForm: {
        shopNumber: "",
        shopName: "",
        floorId: "",
        bizFormatId: "",
        shopEnglishName: "",
        num: "",
        addShopTime: "",
        addr: "",
        shopLogoPath: "",
        isShopEnabled: "",
        shopWeight: 100,
        floorName: "",
        bizFormatType: "",
        shoppicture: "",
        logo: "",
        shopDescript: ""
      },
      pictureLists: [],
      options: [],
      items: [],
      selectShops: [{ label: "启用", value: 1 }, { label: "停用", value: 0 }],
      dialogVisible: "false",
      dialogImageUrl: "",
      imageUrl: "",
      shops: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      loading: false,
      editFormRules: {
        shopName: [
          { required: true, message: "请输入商铺名称", trigger: "blur" }
        ],
        shopNumber: [
          { required: true, message: "请输入商铺编码", trigger: "blur" }
        ],
        floorId: [
          {
            type: "number",
            required: true,
            message: "请输入商铺楼层",
            trigger: "blur"
          }
        ],
        bizFormatId: [
          {
            type: "number",
            required: true,
            message: "请输入业务类型",
            trigger: "blur"
          }
        ],
        shopHouseNumber: [
          { required: true, message: "请输入门牌号", trigger: "blur" }
        ]
      },
      shopEnableds: [],
      floorNum: "",
      stateType: "",
      sleectedShop: "",
      filters: {
        findName: "",
        findCode: "",
        findNum: ""
      },
      fileList: [],
      pics: [],
      timeValue: "",
      shopSrc: ip() + "/shop/pictures",
      logoSrc: ip() + "/shop/logo",
      editAble: false,
      // showEdit: []
      dialogEdit: false,
      dateChange: ""
    };
  },
  methods: {
    open() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    close() {
      this.dialogFormVisible = false;
      this.imageUrl = "";
      this.createForm = Object.assign({}, this.newCreateForm);
      this.$refs.upload.clearFiles();
      this.fileList = [];
    },
    handleRemove(file, fileList) {
      this.pictureLists = fileList;
      for (let i = 0; i < this.pics.length; i++) {
        if (this.pics[i].shopPicturePath == file.url) {
          this.pics.splice(this.pics[i], 1);
        }
      }
    },
    handlePictureCardPreview(res, file, fileList) {
      if (this.dialogStatus == "create") {
        let pictureList = {};
        this.pictureLists = fileList;
      } else {
        let pic = {};
        pic.shopPictureName = file.response.data[0].fileNewName;
        pic.shopPicturePath = file.response.data[0].filePath;
        pic.shopPictureSize = file.response.data[0].fileSize;
        this.pics.push(pic);
      }
    },
    handleAvatarSuccess(res, file) {
      this.createForm.shopLogoPath = res.data.filePath;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {},
    createData(createForm) {
      this.$refs[createForm].validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.createForm);
          let data = {};
          data.bizShop = para;
          data.pictureList = [];
          for (let i = 0; i < this.pictureLists.length; i++) {
            let pics = {};
            pics.shopPictureName = this.pictureLists[
              i
            ].response.data[0].fileNewName;
            pics.shopPictureSize = this.pictureLists[
              i
            ].response.data[0].fileSize;
            pics.shopPicturePath = this.pictureLists[
              i
            ].response.data[0].filePath;
            data.pictureList.push(pics);
          }
          if (data.pictureList.length != 0) {
            if (this.imageUrl != "") {
              addUser(data).then(res => {
                if (res.data.code != 30002) {
                  this.$message({
                    message: "提交成功",
                    type: "success"
                  });
                  this.$refs["createForm"].resetFields();
                  this.dialogFormVisible = false;
                  this.imageUrl = "";
                  this.pictureLists = [];
                  this.$refs.upload.clearFiles();
                  this.getUsers();
                } else {
                  if (res.data.data.indexOf("name") != -1) {
                    this.$confirm("商铺名称重复");
                  } else {
                    this.$confirm("商铺编码重复");
                  }
                }
              });
            } else {
              this.$confirm("请上传商铺LOGO");
            }
          } else {
            this.$confirm("请上传商铺图片");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(createForm) {
      this.dialogFormVisible = false;
      this.createForm = Object.assign({}, this.newCreateForm);
      this.imageUrl = "";
      this.$refs.upload.clearFiles();
      this.fileList = [];
    },

    handleEdit: function(index, row) {
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.createForm = Object.assign({}, row);
      this.imageUrl = row.shopLogoPath;
      let para = {
        id: row.shopId
      };
      getPic(para).then(res => {
        this.createForm.shopDescript = res.data.data.shopDescript;
        if (res.data.data.length != 0) {
          this.pics = res.data.data.pictures;
          for (let i = 0; i < res.data.data.pictures.length; i++) {
            this.fileList.push({
              url: res.data.data.pictures[i].shopPicturePath
            });
          }
        }
      });
    },
    //编辑
    updateData(createForm) {
      this.$refs[createForm].validate(valid => {
        if (valid) {
          this.$refs.createForm.validate(valid => {
            // this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.createForm.pictures = this.pics;
            let para = Object.assign({}, this.createForm);
            editUser(para).then(res => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["createForm"].resetFields();
              this.dialogFormVisible = false;
              this.$refs.upload.clearFiles();
              this.imageUrl = "";
              this.fileList = [];
              this.getUsers();
            });
            // });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    change_num(val) {
      this.pageNum = parseInt(val);
      this.getUsers();
    },

    handleSizeChange(val) {
      this.pageSize = parseInt(val);
      this.getUsers();
    },
    //获取用户列表

    getUsers() {
      let para = {
        shopName: this.filters.findName,
        shopNumber: this.filters.findCode,
        shopHouseNumber: this.filters.findNum,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        floorId: this.floorNum,
        bizFormatId: this.bizFormatId,
        isShopEnabled: this.sleectedShop
      };
      getUserListPage(para)
        .then(res => {
          this.total = res.data.data.total;
          this.shops = res.data.data.list;
          this.pageNum = res.data.data.pageNum;
          this.pageSize = res.data.data.pageSize;
        })
        .catch(error => {
          if (error) {
            this.$router.push("/login");
          }
        });
      getBusinessFormats().then(res => {
        this.items = res.data.data;
      });
      getFloors().then(res => {
        this.options = res.data.data;
      });
    },
    //删除
    handleDel(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = { id: row.shopId };
          switchStart(para).then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUsers();
          });
        })
        .catch(() => {});
    },
    handleModifyStatus(row, status) {
      this.$confirm("确定执行此操作吗？", "提示", {})
        .then(() => {
          let para = { id: row.shopId };
          removeUser(para).then(res => {
            this.getUsers();
          });
        })
        .catch(() => {});
    },
    changeOnline(row, data) {
      this.$confirm("确定执行此操作吗？", "提示", {})
        .then(() => {
          for (let i = 0; i < this.shops.length; i++) {
            const item = this.shops[i];
            if (row.id === item.shopId) {
              item.isShopEnabled = data === 0 ? 1 : 0;
            }
          }
          let para = { id: row.shopId };
          removeUser(para).then(res => {
            this.getUsers();
          });
        })
        .catch(() => {});
    },
    selectFloor() {
      // this.floorId = this.floorNum;
      this.getUsers();
    },
    selectType() {
      this.bizFormatId = this.stateType;
      this.getUsers();
    },
    selectShopEnabled() {
      // this.isShop = this.sleectedShop;
      this.getUsers();
    },
    changeTime(t) {
      let y = t.getFullYear();
      let m =
        t.getMonth() + 1 < 10 ? "0" + (t.getMonth() + 1) : t.getMonth() + 1;
      let d = t.getDate() < 10 ? "0" + t.getDate() : t.getDate();
      return y + "-" + m + "-" + d;
    },
    changeDate(val) {
      this.dateChange = val;
    },
    getTime(createForm) {
      let para = Object.assign({}, this.createForm);
      let val = this.dateChange;
      if (val) {
        let activeTime = val[0];
        let invalidTime = val[1];
        para["saleStartTime"] = activeTime;
        para["saleEndTime"] = invalidTime;
      } else if (this.dateChange === null) {
        para["saleStartTime"] = "";
        para["saleEndTime"] = "";
      } else {
        para["saleStartTime"] = para.saleStartTime;
        para["saleEndTime"] = para.saleEndTime;
      }
      editShopTime(para).then(res => {
        this.$message({
          message: "提交成功",
          type: "success"
        });
        this.dialogEdit = false;
        this.timeValue = "";
        this.getUsers();
      });
      // }
    },
    dbchange(index, row) {
      this.dateChange = "";
      this.dialogEdit = true;
      this.createForm = Object.assign({}, row);
      if (this.createForm.saleStartTime) {
        this.timeValue = [
          this.createForm.saleStartTime,
          this.createForm.saleEndTime
        ];
      } else {
        this.timeValue = ["", ""];
      }
    }
  },
  filters: {
    filterOnline(data) {
      if (Number(data) == 0) {
        return "停用";
      } else {
        return "启用";
      }
    }
  },
  mounted() {
    this.getUsers();
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.logoBefore::before {
  position: relative;
  left: 18px;
  top: 28px;
  content: "*";
  color: #ff4949;
  margin-right: 4px;
}
.pic::before {
  position: relative;
  left: 0;
  top: 30px;
  content: "*";
  color: #ff4949;
  margin-right: 4px;
}
</style>
