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
import DetailProduct from "./components/DetailProduct";
import CreateOrder from "./components/CreateOrder";
import Cert from "./components/Cert";
import Cart from "./components/Cart";
import CertTest from "./components/CertTest";
import AdditionalCert from "./components/AdditionalCert";
import ChangePassword from "./components/ChangePassword";
import MyCategory from "./components/MyCategory";
import ChoicePaytype from "./components/ChoicePayType";
import OrderView from "./components/OrderView";
import PurchaseSuccess from "./components/PurchaseSuccess";
//import jusoPopup from "../popup/jusoPopup.jsp";

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
    {path:'/DetailProduct/:product', component : DetailProduct },
    {path:'/Cert', component : Cert },
    {path:'/Cart', component : Cart },
    {path:'/CertTest', component : CertTest },
    {path:'/AdditionalCert', component : AdditionalCert },
    {path:'/MyCategory', component : MyCategory },
    {path:'/ChangePassword', component : ChangePassword },
    {path:'/CreateOrder/:number/:product', component : CreateOrder },
    {path:'/ChoicePayType/:order', component : ChoicePaytype },
    {path:'/OrderView', component : OrderView },
    {path:'/PurchaseSuccess/:order', component : PurchaseSuccess },
    {path:'*', component: NotFound }

    //{path: 'jusoPopup', component : jusoPopup }
  ]
});
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
