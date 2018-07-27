import Vue from 'vue';
import Router from 'vue-router';
import BootstrapVue from 'bootstrap-vue';

Vue.use(Router);
Vue.use(BootstrapVue);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: require('@/components/Login').default
    },
    {
      path: '/timbanganpage',
      name: 'timbanganpage',
      component: require('@/components/TimbanganPage').default
    },
    {
      path: '/konfigurasi',
      name: 'konfigurasi',
      component: require('@/components/Konfigurasi').default
    }
  ]
})
