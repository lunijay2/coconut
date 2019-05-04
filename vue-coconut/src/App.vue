<template>
  <div id="app">
    <Navbar></Navbar>
    <img alt="Vue logo" src="./assets/logo.png">
    <router-view></router-view>
  </div>
</template>

<script>

  import VueRouter from 'vue-router';
  //import axios from 'axios';

  import Navbar from "./components/Navbar";
  import Login from "./components/Login";
  import ChoiceMemberType from "./components/ChoiceMemberType";
  import RegisterIndivisual from "./components/RegisterIndivisual";
  import RegisterEnterpriseBuyer from "./components/RegisterEnterpriseBuyer";
  import RegisterEnterpriseSeller from "./components/RegisterEnterpriseSeller";


  const router = new VueRouter({
    mode: 'history',
    routes : [
      {path:'/Login', component : Login},
      {path:'/ChoiceMemberType', component : ChoiceMemberType},
      {path:'/RegisterIndivisual', component : RegisterIndivisual},
      {path:'/RegisterEnterpriseBuyer', component : RegisterEnterpriseBuyer},
      {path:'/RegisterEnterpriseSeller', component : RegisterEnterpriseSeller}
    ]
  })

  export default {
    name: 'app',
    router,
    //axios,
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
