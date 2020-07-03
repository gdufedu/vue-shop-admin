<template>
  <el-card class="box-card">
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <el-row>
      <el-col :span="24" class="searchArea">
        <el-button type="success" @click="addGoodscate">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="分类名称" label-width="120px">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类" label-width="120px">
          <!-- options：数据源 -->
          <!-- props：指定配置对象 -->
          <el-cascader
            :props="defaultProp"
            change-on-select
            clearable
            :options="caslist"
            v-model="selectedOptions"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <el-table height="450" :data="list" style="width:100%">
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id" parentKey="cat_pid" levelKey="cat_level" childKey="children"
      ></el-tree-grid>
      <el-table-column label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted===false">有效</span>
          <span v-else-if="scope.row.cat_deleted===true">无效</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
            @click="showEditdia(scope.row)"
          >            
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
            @click="showDelefirm(scope.row)"
          >            
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
var ElTreeGrid = require('element-tree-grid');
export default {
  components:{
    ElTreeGrid
  },
  data() {
    return {
      list: [],
      pagenum: 1,
      pagesize: 50,
      total: 1,
      dialogFormVisibleAdd: false,
      form: {
        cat_pid: -1,
        cat_name:'',
        cat_level:-1
      },
      formLabelWidth:"140px",
      // 父级分类列表
      caslist: [],
      // 选中的父级Id数组
      selectedOptions: [],
      // 指定级联选择器的配置对象
      defaultProp: {
        // 配置触发选项 hover/click
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          // 当前列 自定义模板
          type: "template",
          template: "isOk"
        },
        {
          label: "排序",
          // 当前列 自定义模板
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          // 当前列 自定义模板
          type: "template",
          template: "opt"
        }
      ],
      // 添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      // 编辑对话框 控制
      editCateDialogVisible: false,
      // 编辑分类表单验证
      editCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      // 编辑表单 绑定对象
      editCateForm: ""
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    showDelefirm() {

    },
    // 获取商品分类
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      // 给数据列表赋值
      this.list = res.data.data.result;
      // 总数据条数
      this.total = res.data.data.total;
    },
    // 监听 pageSizeChange
    handleSizeChange(newSize) {
      this.pagesize = newSize;
      this.getGoodsCate();
    },
    // 监听 pagenum改变
    handleCurrentChange(newPage) {
      this.pagenum = newPage;
      this.getGoodsCate();
    },
    // 添加操作
    async addGoodscate() {
      // 先获取父级分类数据
      const res = await this.$http.get(`categories?type=2`);
      this.caslist = res.data.data;
      // 再打开对话框
      this.dialogFormVisibleAdd = true;
    },
    
    async addCate() {
      if (this.selectedOptions.length === 0) {
        this.form.cat_pid = 0;
        this.form.cat_level = 0;
      } else if(this.selectedOptions.length === 1) {
        this.form.cat_pid = this.selectedOptions[0];
        this.form.cat_level = 1;
      } else if(this.selectedOptions.length === 2) {
        this.form.cat_pid = this.selectedOptions[1];
        this.form.cat_level = 2;
      }
      const res = await this.$http.post(`categories`, this.form);
      this.getGoodsCate();
      this.dialogFormVisibleAdd = false;
      this.form = {};
    },
    async showEditdia(id) {
      const { data: res } = await this.$http.get("categories/" + id);
      if (res.meta.status !== 200) return this.$message.error("获取分类失败！");
      this.editCateForm = res.data;
      this.editCateDialogVisible = true;
    },
  }
};
</script>

<style lang='scss' scoped>
.treeTable {
  margin-top: 20px;
}
// .el-cascader {
//   width: 100%;
// }
</style>
