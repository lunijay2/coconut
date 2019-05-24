import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import store  from './store'

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

Vue.use(VueRouter);

new Vue({
  store,
  VueRouter,
  render: h => h(App),
}).$mount('#app')
