import Vue from 'vue';
import axios from 'axios';

import App from './App';
import router from './router';
import store from './store';

// Vue.use(VueMqtt, 'mqtt://192.168.10.151:1883');
import '@/assets/css/bootstrap.min.css';
import '@/assets/css/style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app');
