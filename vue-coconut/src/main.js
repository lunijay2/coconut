import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueFlashMessage from 'vue-flash-message';

Vue.prototype.$axios = axios;
Vue.config.productionTip = false

Vue.use(VueRouter);
Vue.use(VueFlashMessage);

new Vue({
  render: h => h(App),
}).$mount('#app')
