<template>
  <div id="app">
    <Navbar></Navbar>
    <img alt="Vue logo" src="./assets/logo.png">
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import VueRouter from 'vue-router';

const router = new VueRouter({
  mode: 'history',
  routes : [
    {path:'/login', component : Login}
  ]
})

export default {
  name: 'app',
  router,
  components: {
    Navbar,
    Login,
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
