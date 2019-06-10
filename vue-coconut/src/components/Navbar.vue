<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <!--홈 이미지-->
        <router-link to="/" class="navbar-brand"><img src="./coconut.png" style="width:35px"></router-link>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <ul class="navbar-nav ml-auto">
            <li class="nav-item" v-if="this.$store.state.pToken">
                <router-link to="/MyPage" class="nav-link">
                    마이페이지
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/AllProduct" class="nav-link">
                    상품보기
                </router-link>
            </li>

            <li class="nav-item"> <!--v-if="this.$store.state.pToken">-->
                <router-link to="/Pay" class="nav-link">
                    결제
                </router-link>
            </li>
            <li class="nav-item" v-if="!this.$store.state.pToken">
                <router-link to="/ChoiceMemberType" class="nav-link">
                    회원가입
                </router-link>
            </li>
            <li class="nav-item" v-if="!this.$store.state.pToken">
                <router-link to="/Login" class="nav-link">
                    로그인
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/Test" class="nav-link">
                    결제 테스트
                </router-link>
            </li>
            <!--
            <li class="nav-item">
                <router-link to="/AllStore" class="nav-link">
                    상점보기
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/ImageUpload" class="nav-link">
                    이미지 업로드
                </router-link>
            </li>
            -->
            <li class="nav-item" v-if="this.$store.state.pToken">
                <a class="nav-link" href="#" @click.prevent="onLogoutClick">로그아웃</a>
            </li>
        </ul>

    </nav>
</template>

<script>
    export default {
        name: 'Navbar',
        methods : {
            onLogoutClick : function () {
                this.$store.dispatch('LOGOUT');
                this.$router.replace({ path : '/Login' });
            }
        }
    }
</script>

<style scoped>
</style>