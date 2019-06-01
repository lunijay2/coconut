<template>
    <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
            <h2>개인 구매 회원가입</h2>
            <br><br>
                <input type="text" v-model="newUser.id" class="form-control" placeholder="아이디">
                <small id="idHelp" class="form-text text-muted float-left">아이디는 6글자 이상이어야 합니다.</small>
                <br><br>
                <input type="password" v-model="newUser.password" class="form-control" placeholder="비밀번호">
                <small id="passwordHelp" class="form-text text-muted float-left">비밀번호는 8글자 이상, 영문 대/소문자, 숫자, 특수문자가 포함되어야 합니다.</small>
                <br><br>
                <input type="text" v-model="newUser.name" class="form-control" placeholder="이름">
                <br>
                <input type="text" v-model="newUser.tel" class="form-control" placeholder="전화번호">
                <br>
                <input type="text" v-model="newUser.addr" class="form-control" placeholder="주소">
                <br>
                <input type="text" v-model="newUser.email" class="form-control" placeholder="이메일 abc@example.com">
                <br><br>
                <button @click="newUserSubmit" type="button" class="btn btn-primary">회원가입</button>
        </div>
        <div class="col-md-3"></div>
    </div>
</template>

<script>
    var indi = 1;

    export default {
        name: "RegisterIndivisual",
        data(){
            return {
                newUser : {
                    id: '',
                    password: '',
                    name: '',
                    tel: '',
                    addr: '',
                    email: '',
                    indi: indi
                }
            }
        },
        methods : {
            newUserSubmit : function () {
                let pathuser = {
                    path : '/users/register',
                    user : this.newUser
                };
                this.$store.dispatch('REGISTER', pathuser)
                    .then( response => {
                        if(response.data.success == true) {
                            alert('Indivisual user register Success');
                            console.log('Indivisual user register Success');
                            this.$router.replace({ path : '/Login' });
                        } else {
                            alert('Indivisual user register Failure');
                            console.log('Indivisual user register Failure')
                        }
                    }).catch( err => {
                    console.log('Indivisual user register Err : '+ err);
                });
            }
        }
    }
</script>

<style scoped>

</style>