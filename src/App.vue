<template>
  <div id="app">
  <form>
    <header>
      <Navbar></Navbar>
    </header>
<br><br>
    <section>
        <router-view />
      
    </section>
  </form>
  </div>
</template>

<script>
import Navbar from "./components/Navbar";

export default {
  name: "app",
  components: {
    Navbar
  },
  created() {
    this.$store.commit("GET_TOKENS");
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  top: 70px;
  position: relative;
  background-color: #f8f8f8;
  height: -webkit-fill-available;
  width: 100%
}
</style>
