<template>
  <div id="app">
    <img alt="Vue logo" width="150px"  height="150px" src="./assets/coconut.svg">
    <p></p>
    <router-view/>
    <Navbar></Navbar>
  </div>
</template>

<script>
  import Navbar from "./components/Navbar";
  export default {
    name: 'app',
    components : {
      Navbar
    },
    created() {
      this.$store.commit('GET_TOKENS');
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
