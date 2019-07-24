<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
    <!--홈 이미지-->
    <router-link to="/" class="navbar-brand">
    <div class="centered">COCONUT</div>
    </router-link>

    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarsExampleDefault"
      aria-controls="navbarsExampleDefault"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarsExampleDefault">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item" v-if="this.$store.state.pToken">
          <router-link to="/MyPage" class="nav-link">MyPage</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/AllProduct" class="nav-link">Product</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/AllStore" class="nav-link">Store</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/Pay" class="nav-link">Pay</router-link>
        </li>
        <li class="nav-item" v-if="!this.$store.state.pToken">
          <router-link to="/ChoiceMemberType" class="nav-link">SignUp</router-link>
        </li>
        <li class="nav-item" v-if="!this.$store.state.pToken">
          <router-link to="/Login" class="nav-link">Login</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/Test" class="nav-link">Test</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/ImageUpload" class="nav-link">Image</router-link>
        </li>
        <li class="nav-item" v-if="this.$store.state.pToken">
          <a class="nav-link" href="#" @click.prevent="onLogoutClick">Logout</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  methods: {
    onLogoutClick: function() {
      this.$store.dispatch("LOGOUT");
      this.$router.replace({ path: "/Login" });
    }
  }
};
</script>

<style scoped>
.centered {position: absolute; left: 45%; bottom: 25%; }

router-link{
  text-decoration: none; 
  color: #333333;
}
</style>