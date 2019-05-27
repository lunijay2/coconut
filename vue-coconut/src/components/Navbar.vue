<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
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
                    <li class="nav-item" v-if="this.$store.state.pToken">
                        <a class="nav-link" href="#" @click.prevent="onLogoutClick">로그아웃</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>


<script>
    import vrouter from 'vue-router'
    export default {
        name: 'Navbar',
        methods : {
            onLogoutClick : function () {
                this.$store.dispatch('LOGOUT')
                    .then( function () {
                        location.reload();
                        //this.$router.go({ path : '/Login' });
                    });
            }
        }
    }
</script>

<style scoped>

</style>