<template>
    <div> <h2>로그인</h2><br><br>
        <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6">
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
                <button @click="onLoginSubmit" type="button" class="btn btn-primary">로그인</button>
            </div>
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
                            return this.$store.commit('LOGIN', response);
                            console.log('로그인 성공 : '+ JSON.stringify(response));
                            alert('로그인 성공');
                            this.$router.replace({ path : '/' });
                        } else {
                            console.log("Login Error! 1 : "+JSON.stringify(response));
                            return alert('로그인 실패 1');
                        }
                    })
                    .catch( err => {
                        console.log("Login Error! 2 : ", JSON.stringify(err));
                        return alert('로그인 실패 2');
                    });
            }
        }
    }
</script>

<style scoped>

</style>