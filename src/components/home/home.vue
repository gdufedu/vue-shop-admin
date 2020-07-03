<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <img src="../../assets/logo.png" class="logo" />
          </div>
        </el-col>
        <el-col :span="20" class="middle">
          <h3>电商后台管理系统</h3>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <a href="#" class="loginout" @click.prevent="handleSignout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu
        :router="true"
        :unique-opened="true"
        >
          <el-submenu :index="''+item1.order" v-for="(item1, index) in menus" :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="(item2, index) in item1.children" :key="index">
              <i class="el-icon-success"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menus:[]
    }
  },
  beforeCreate() {
    
  },
  created() {
    this.getMenus();
  },
  methods: {
    async getMenus() {
      const res = await this.$http.get(`menus`);
      this.menus = res.data.data;
    },
    handleSignout() {
      localStorage.clear();
      this.$message.success('退出成功');
      this.$router.push({name:'login'});
    }
  },
};
</script>
<style lang="scss">
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
}
.aside {
  background-color: #d3dce6;
}
.main {
  background-color: #e9eef3;
}
.middle {
  text-align: center;
}
.loginout {
  line-height: 60px;
  text-decoration: none;
}
.logo {
  height: 60px;
}
</style>