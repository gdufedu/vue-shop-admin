import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import MyBread from '@/components/cuscom/myBread';
import MyServerHttp from '@/plugins/http.js';
import moment from 'moment';
import 'element-ui/lib/theme-chalk/index.css';
import  '@/assets/css/reset.css';
import router from './router'
Vue.use(ElementUI);
Vue.use(MyServerHttp);
Vue.config.productionTip = false;
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD');
});
Vue.component(MyBread.name, MyBread);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
