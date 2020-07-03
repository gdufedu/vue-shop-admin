import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login/login.vue';
import Home from '@/components/home/home.vue';
import Users from '@/components/users/users.vue';
import Right from '@/components/rights/right.vue';
import Role from '@/components/rights/role.vue';
import Goodslist from '@/components/goods/goodslist.vue';
import GoodsAdd from '@/components/goods/goodsadd.vue';
import Cateparams from '@/components/goods/cateparams.vue';
import Goodscate from '@/components/goods/goodscate.vue';
import Orders from '@/components/order/order.vue';
import Reports from '@/components/reports/reports.vue';
import { Message } from 'element-ui';
Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      redirect: '/login'
    },
    {
      name: 'login',
      path: '/login',
      component:Login
    },
    {
      name: 'home',
      path: '/',
      component:Home,
      children: [
        {
          name: 'users',
          path: 'users',
          component: Users
        },
        {
          name: 'right',
          path: '/rights',
          component: Right
        },
        {
          name: 'roles',
          path: '/roles',
          component: Role
        },
        {
          name: 'goods',
          path: '/goods',
          component: Goodslist
        },
        {
          name: 'goodsadd',
          path: '/goodsadd',
          component: GoodsAdd
        },
        {
          name: 'params',
          path: '/params',
          component: Cateparams
        },
        {
          name: 'categories',
          path: '/categories',
          component: Goodscate
        },
        {
          name: 'orders',
          path: '/orders',
          component: Orders
        },
        {
          name: 'reports',
          path: '/reports',
          component: Reports
        }
      ]
    }
];
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
};

const router = new VueRouter({
  routes
});
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  } else {
    const token = localStorage.getItem('token');
    if (!token) {
      Message.warning('请先登录');
      router.push({name:'login'});
      return;
    }
    next();
  }
});
export default router;
