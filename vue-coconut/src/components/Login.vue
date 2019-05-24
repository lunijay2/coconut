<template>
    <div> <h2>로그인</h2><br><br>
        <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6">
                <form @submit="onLoginSubmit">
                    <div class="form-group row">
                        <label for="id" class="col-sm-2 col-form-label">아이디</label>
                        <div class="col-sm-10">
                            <input type="text" id="id" v-model="User.id" class="form-control" placeholder="ID">
                        </div>
                        <br><br><br>
                        <label for="password" class="col-sm-2 col-form-label">비밀번호</label>
                        <div class="col-sm-10">
                            <input type="password" id="password" v-model="User.password" class="form-control" placeholder="Password">
                        </div>
                    </div>
                    <br>
                    <button type="submit" class="btn btn-primary">로그인</button>
                </form>
            </div>
            <div class="col-md-3"></div>
        </div>
    </div>
</template>

<script>
    import MyPage from "./MyPage";

    export default {
        name: 'Login',

        data(){
            return {
                User : {
                    id: '',
                    password: ''
                }
            }
        },
        methods:{
            onLoginSubmit() {
                const User = this.User;

                if ( !User.id || !User.password ) {
                    return false;
                }

                /*
                this.$store.dispatch('LOGIN', User)
                    .then(function (response) {
                        return this.$store.commit('LOGIN', response.data)
                    })
                    .then(function () {
                        alert('로그인 성공');
                        console.log('로그인 성공');
                    })
                    .catch( function (err) {
                        console.log("Error! : ", err);
                        console.log('로그인 실패');
                    });
                */

                this.$axios.post('http://localhost:3000/users/authenticate', User )
                    .then( response => {
                        this.$store.commit('LOGIN', response.data)
                    })
                    .then(function (data) {
                        alert('로그인 성공');
                    })
                    .then(function () {
                        return router.push({component : MyPage});
                    })
                    .catch( function(err) {
                        console.log("Error! : ", err);
                        console.log('로그인 실패');
                    });
            }
        }
    }
</script>

<style scoped>

</style>