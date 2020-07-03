<template>
  <el-card>
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <el-row class="addrolebtn">
      <el-col>
        <el-button type="info">添加角色</el-button>
      </el-col>
    </el-row>
    <el-table :data="rolelist" style="width: 100%">
      <el-table-column type="expand" width="150">
        <template slot-scope="scope">
          <el-row v-for="(item1, i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag
                @close="deleRight(scope.row, item1.id)"
                closable
                type="success"
              >{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2, i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag
                    @close="deleRight(scope.row, item2.id)"
                    closable
                    type="info"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="deleRight(scope.row, item3.id)"
                    closable
                    v-for="(item3, i) in item2.children"
                    :key="i"
                    type="warning"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="scope.row.children.length === 0">未分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="150"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
            @click="showEditUserDia(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDeleUserMsgBox(scope.row.id)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
            @click="showSetRightDia(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
      <el-tree
        ref="tree"
        :data="treelist"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrcheck"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRight()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      rolelist: [],
      dialogFormVisibleRight: false,
      treelist: [],
      defaultProps:{
          label: 'authName',
          children: 'children'
      },
      arrexpand: [],
      arrcheck: [],
      currRoleId: -1
    };
  },
  created() {
    this.getRolelist();
  },
  methods: {
    async  setRoleRight() {
        let arr1 = this.$refs.tree.getCheckedKeys();
        let arr2 = this.$refs.tree.getHalfCheckedKeys();
        let arr = [...arr1, ...arr2];
        const res = await this.$http.post(`roles/${this.currRoleId}/rights`,
        {rids:arr.join(',')});
        this.getRolelist();
        this.dialogFormVisibleRight = false;
    },
    async showSetRightDia(role) {
        this.currRoleId = role.id;
        const res = await this.$http.get(`rights/tree`);
        this.treelist = res.data.data;
        let arrtemp2 = [];
        role.children.forEach(item1 => {
            item1.children.forEach(item2 => {
                item2.children.forEach(item3 => {
                    arrtemp2.push(item3.id);
                });
            });
        });
        this.arrcheck = arrtemp2;
        
      this.dialogFormVisibleRight = true;
    },
    async deleRight(role, rightId) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      role.children = res.data.data;
    },
    async getRolelist() {
      const res = await this.$http.get(`roles`);
      this.rolelist = res.data.data;
    }
  }
};
</script>