<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <!--홈 <이미지-->
        <div class="container">
        <router-link to="/" class="navbar-brand floa">
            COCONUT
            <!--<div class="centered">COCONUT</div>-->
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
                    <router-link to="/MyPage" class="nav-link">마이페이지</router-link>
                </li>
                <li class="nav-item" v-if="this.$store.state.pToken">
                    <router-link to="/Cert" class="nav-link">Master Cert</router-link>
                </li>
                <li class="nav-item" v-if="this.$store.state.pToken">
                    <router-link to="/CertTest" class="nav-link">Cert Test</router-link>
                </li>
                <!--
                <li class="nav-item" v-if="this.$store.state.pToken">
                    <router-link to="/AdditionalCert" class="nav-link">Additional Cert</router-link>
                </li>
                -->
                <li class="nav-item">
                    <router-link to="/AllProduct" class="nav-link">모든 상품</router-link>
                </li>
                <!--
                <li class="nav-item">
                    <router-link to="/AllStore" class="nav-link">Store</router-link>
                </li>
                -->
                <li class="nav-item">
                    <router-link to="/Pay" class="nav-link">QR결제</router-link>
                </li>
                <li class="nav-item" v-if="!this.$store.state.pToken">
                    <router-link to="/ChoiceMemberType" class="nav-link">회원가입</router-link>
                </li>
                <li class="nav-item" v-if="!this.$store.state.pToken">
                    <router-link to="/Login" class="nav-link">로그인</router-link>
                </li>
                <!--
                <li class="nav-item">
                    <router-link to="/Test" class="nav-link">Test</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/ImageUpload" class="nav-link">Image</router-link>
                </li>
                -->
                <li class="nav-item" v-if="this.$store.state.pToken">
                    <a class="nav-link" href="#" @click.prevent="onLogoutClick">로그아웃</a>
                </li>
            </ul>
        </div>
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