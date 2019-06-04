import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import store  from './store'
import VueQrcodeReader from 'vue-qrcode-reader'

Vue.use(VueQrcodeReader);

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.prototype.$EventBus = new Vue();

Vue.use(VueRouter);

import App from './App.vue'
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import ChoiceMemberType from "./components/ChoiceMemberType";
import RegisterIndivisual from "./components/RegisterIndivisual";
import RegisterEnterpriseBuyer from "./components/RegisterEnterpriseBuyer";
import RegisterEnterpriseSeller from "./components/RegisterEnterpriseSeller";
import MyPage from "./components/MyPage";
import Pay from './components/Pay';
import Test from './components/Test';
import NotFound from "./components/NotFound";
import ImageUpload from './components/ImageUpload';
import CreateStore from "./components/CreateStore";
import AllProduct from "./components/AllProduct";
import AllStore from "./components/AllStore";
import Category from "./components/Category";

const router = new VueRouter({
  mode: 'history',
  routes : [
    {path:'/', component : Home  },
    {path:'/Login', component : Login },
    {path:'/Navbar', component : Navbar },
    {path:'/ChoiceMemberType', component : ChoiceMemberType},
    {path:'/RegisterIndivisual', component : RegisterIndivisual },
    {path:'/RegisterEnterpriseBuyer', component : RegisterEnterpriseBuyer },
    {path:'/RegisterEnterpriseSeller', component : RegisterEnterpriseSeller },
    {path:'/MyPage', component : MyPage },
    {path:'/Pay', component : Pay },
    {path: '/Test', component : Test },
    {path: '/ImageUpload', component : ImageUpload },
    {path:'/CreateStore', component : CreateStore },
    {path:'/AllProduct', component : AllProduct },
    {path:'/AllStore', component : AllStore },
    {path:'/Category', component : Category },
    {path:'*', component: NotFound }
  ]
});
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
