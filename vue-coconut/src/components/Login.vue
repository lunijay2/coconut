<template>
    <div>
        <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6">
                <h2 class="page-header">로그인</h2><br>
                <div class="alert alert-warning" role="alert">
                    <h3 class="page-header">ID/PASS 로그인</h3>
                        <div class="form-group">
                            <label>ID (Username)</label>
                            <input type="text" class="form-control" v-model="User.id" name="username">
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" class="form-control" v-model="User.password" name="password">
                        </div>
                    <button @click="onLoginSubmit" type="button" class="btn btn-primary">ID/PASS 로그인</button>
                </div>
            </div>
            <!--
            <div class="col-md-6">
                <div class="alert alert-info" role="alert">
                    <h3 class="page-header">인증서 간편 로그인</h3>
                    <p>
                        인증서 로그인은 서버에서 인증서를 발급받은 경우에만 사용 가능합니다.
                    </p>
                    <br>
                        <div class="form-group">
                            <label>ID (Username)</label>
                            <input type="text" class="form-control" name="username1">
                        </div>
                        <input type="submit" class="btn btn-primary" value="전자서명 간편 로그인">
                </div>
            </div>
            -->
            <div class="col-md-3"></div>
        </div>
    </div>
</template>
<script>
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
                this.$store.dispatch('LOGIN', User)
                    .then( response => {
                        if(response.data.success === true) {
                            this.$store.commit('LOGIN', response);
                            console.log('로그인 성공');
                            //alert('Login Success');
                            this.$router.replace({ path : '/' });
                        } else {
                            console.log("Login Error! 1");
                            return alert('Login Error');
                        }
                    })
                    .catch( err => {
                        console.log("Login Error! 2");
                        return alert('Login Error');
                    });
            }
        }
    }
</script>

<style scoped>

</style>