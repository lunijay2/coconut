<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <!--카테고리-->
       <div class="dropdown">
  <button class="dropbtn" >카테고리</button>
  <div class="dropdown-content">
    <a href="#">패션의류/잡화</a>
    <a href="#">뷰티</a>
    <a href="#">출산/유아동</a>
    <a href="#">식품</a>
    <a href="#">주방용품</a>
  </div>
</div>
        <!--홈 이미지-->
        <div class="container">
            <router-link to="/" class="navbar-brand"><img src="./coconut.png" style="width:35px"></router-link>

            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarsExampleDefault">
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
                    <li class="nav-item">
                        <router-link to="/AllStore" class="nav-link">
                            상점보기
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
                    <li class="nav-item">
                        <router-link to="/ImageUpload" class="nav-link">
                            이미지 업로드
                        </router-link>
                    </li>
                    <li class="nav-item" v-if="this.$store.state.pToken">
                        <a class="nav-link" href="#" @click.prevent="onLogoutClick">로그아웃</a>
                    </li>
                </ul>
            </div>
        </div>
            <input type="text" name="FirstName" placeholder="검색어를 입력해주세요.     ">
                
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
