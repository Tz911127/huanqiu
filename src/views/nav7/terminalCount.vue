<template>
	<section>
    <!-- 过滤 -->
    <el-form :inline = true  :model="filters">
          <el-form-item>
					    <el-select  v-model="stateType" clearable placeholder="终端类型" @change="selectType">
					      <el-option v-for="item in items"  :key="item.value" :label = "item.label" :value = "item.value"></el-option>
				      </el-select>
          </el-form-item>
          <el-form-item>
              <el-select  placeholder="楼层" v-model="floorNum" clearable  @change="selectFloor">
					      <el-option v-for="option in options"  :key="option.floorId" :label = "option.floorName" :value = "option.floorId">
              </el-option>
          </el-select>
          </el-form-item>
          <el-form-item style="float:right">
					  <el-button type="primary" v-on:click="getData">查询</el-button>
				  </el-form-item>
              <el-form-item style="float:right"><el-input clearable v-model="filters.findName" placeholder="终端名称"></el-input></el-form-item>
        </el-form>
		<el-table :data="terminalDara" style="width:100%">
      <el-table-column sortable prop="terminalNumber" label="终端编号"></el-table-column>
			<el-table-column sortable prop="terminalName" label="终端名称"></el-table-column>
			<el-table-column sortable prop="terminalType" label="终端类型">
        <template slot-scope="scope">
           {{scope.row.terminalType | filterType}}
        </template>
      </el-table-column>
			<el-table-column sortable prop="terminalIp" label="终端IP"></el-table-column>
			<el-table-column sortable prop="floorName" label="楼层"></el-table-column>
			<el-table-column sortable prop="isTerminalOnline" label="状态">
				<template slot-scope="scope">
                {{scope.row.isTerminalOnline | filterOnline}}
              </template> 
			</el-table-column>
			<el-table-column sortable prop="terminalVisitAmount" label="访问量"></el-table-column>
		</el-table>
		<!-- 工具 -->
    <el-col :span="24" class="toolbar">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total='total'></el-pagination>
    </el-col>
	</section>
</template>
<script>
import { getTerminalVisits, getStatePage, getFloorPage } from "../../api/api";
export default {
  data() {
    return {
      terminalDara: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      stateType: "",
      items: [
        { label: "二维码", value: 0 },
        { label: "竖屏", value: 1 },
        { label: "横屏", value: 2 }
      ],
      floorNum: "",
      options: [],
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
        terminalType: this.stateType,
        floorId: this.floorNum,
        terminalName: this.filters.findName
      };
      getTerminalVisits(para)
        .then(res => {
          this.terminalDara = res.data.data.list;
          this.total = res.data.data.total;
        })
        .catch(error => {
          if (error) {
            this.$router.push("/login");
          }
        });
      getStatePage(para).then(res => {
        // this.items = res.data.data.list;
      });
      getFloorPage(para).then(res => {
        this.options = res.data.data.list;
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
      // this.bizFormatId = this.stateType;
      this.getData();
    },
    selectFloor() {
      // this.floorId = this.floorNum;
      this.getData();
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
    this.getData();
  }
};
</script>

