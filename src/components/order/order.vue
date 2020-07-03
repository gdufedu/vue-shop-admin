<template>
  <el-card>
    <my-bread level1="订单管理" level2="订单列表"></my-bread>
    <!-- 订单列表 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column type="index" label="#" width="40"></el-table-column>
      <el-table-column label="订单编号" prop="order_number" width="180"></el-table-column>
      <el-table-column label="订单价格" prop="order_price"></el-table-column>
      <el-table-column label="是否付款" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_pay === '0'">已付款</el-tag>
          <el-tag type="danger" v-if="scope.row.order_pay === '1'">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send" width="100"></el-table-column>
      <el-table-column label="下单时间" width="90">
        <template slot-scope="scope">{{scope.row.create_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditdia"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="省市区" label-width="120px">
          <el-cascader :props="defaultProp" clearable :options="catlist" v-model="selectedOptions"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="120px">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import catlist from './city_data2017_element';
export default {
  data() {
    return {
      list: [],
      // 修改地址对话框
      dialogFormVisible: false,
      form: {
        address: ""
      },
      catlist: [],
      selectedOptions: [],
      defaultProp: {
        // 配置触发选项 hover/click
        expandTrigger: "hover"
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const res = await this.$http.get(`orders?pagenum=1&pagesize=10`);

      this.list = res.data.data.goods;
    },
    showEditdia() {
      this.catlist = catlist;
      this.dialogFormVisible = true;
    }
  }
};
</script>
