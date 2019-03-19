<template>
    <section>
      <!-- 过滤 -->
        <el-form :inline = true  :model="filters">
          <el-form-item style="float:right">
					  <el-button type="primary" v-on:click="getData">查询</el-button>
				  </el-form-item>
              <el-form-item style="float:right"><el-input clearable v-model="filters.findName" placeholder="终端名称"></el-input></el-form-item>
        </el-form>
        <el-table :data="shopCount" style="width: 100%">
            <el-table-column label="商铺名称" prop="shopName" sortable></el-table-column>
            <el-table-column label="商铺编码" prop="shopNumber"></el-table-column>
            <el-table-column label="所属楼层" prop="floorName"></el-table-column>
            <el-table-column label="业务类型" prop="bizFormatType"></el-table-column>
            <el-table-column label="访问量" prop="shopVisitAmount" sortable></el-table-column>
        </el-table>
        <!-- 工具 -->
        <el-col :span="24" class="toolbar">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total='total'></el-pagination>
        </el-col>
   </section>
</template>
<script>
import { getShopVisits, getStatePage } from "../../api/api";
export default {
  data() {
    return {
      shopCount: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      stateType: "",
      items: [],
      filters: {
        findName: ""
      }
    };
  },
  methods: {
    getData() {
      let para = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        shopName: this.filters.findName
      };
      getShopVisits(para)
        .then(res => {
          this.shopCount = res.data.data.list;
          this.total = res.data.data.total;
        })
        .catch(error => {
          if (error) {
            this.$router.push("/login");
          }
        });
      getStatePage(para).then(res => {
        this.items = res.data.data.list;
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
    selectType() {
      this.bizFormatId = this.stateType;
      this.getData();
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
