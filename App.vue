<template>
  <form>
    <header>
      <Navbar></Navbar>
    </header>

    <section>
      <div id="app">
        <router-view />
      </div>
    </section>
  </form>
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
  top: 97px;
  position: relative;
  background-color: #f5f5dc;
  height: -webkit-fill-available;
  width: 100%;
  margin: 0 auto;
}
</style>