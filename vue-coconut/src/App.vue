<template>
  <div id="app">
    <Navbar></Navbar>
    <img alt="Vue logo" src="./assets/coconut.svg">
    <router-view></router-view>
  </div>
</template>

<script>

  import VueRouter from 'vue-router';
  //import axios from 'axios';
  import Home from "./components/Home";
  import Navbar from "./components/Navbar";
  import Login from "./components/Login";
  import ChoiceMemberType from "./components/ChoiceMemberType";
  import RegisterIndivisual from "./components/RegisterIndivisual";
  import RegisterEnterpriseBuyer from "./components/RegisterEnterpriseBuyer";
  import RegisterEnterpriseSeller from "./components/RegisterEnterpriseSeller";
  import MyPage from "./components/MyPage";
  import NotFound from "./components/NotFound";

  const router = new VueRouter({
    mode: 'history',
    routes : [
      {path:'/Home', component : Home},
      {path:'/Login', component : Login},
      {path:'/ChoiceMemberType', component : ChoiceMemberType},
      {path:'/RegisterIndivisual', component : RegisterIndivisual},
      {path:'/RegisterEnterpriseBuyer', component : RegisterEnterpriseBuyer},
      {path:'/RegisterEnterpriseSeller', component : RegisterEnterpriseSeller},
      {path:'/MyPage', component : MyPage},
      {path:'*', component: NotFound }
    ]
  })

  export default {
    name: 'app',
    router,
    components: {
      Navbar
    }
  }

</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

</style>
