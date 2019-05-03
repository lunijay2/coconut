<template>
    <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
            <input type="text" v-model="id" class="form-control" id="staticEmail" placeholder="ID" value="email@example.com">
            <small id="idHelp" class="form-text text-muted float-left">아이디는 6글자 이상이어야 합니다.</small>
            <br><br>
            <input type="password" v-model="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
            <small id="passwordHelp" class="form-text text-muted float-left">비밀번호는 8글자 이상, 영문 대/소문자, 숫자, 특수문자가 포함되어야 합니다.</small>
            <br><br>
            <input type="email" v-model="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
            <small id="emailHelp" class="form-text text-muted float-left">We'll never share your email with anyone else.</small>
            <br><br><br>
            <button type="submit" class="btn btn-primary" v-on:click="newUserReg">회원가입</button>
        </div>
        <div class="col-md-3"></div>
    </div>
</template>

<script>
    export default {
        name: 'Login',

        data(){
            return {
                newUser : {
                    id: '',
                    password: '',
                    email: ''
                }
            }
        }
    }
</script>

<style scoped>

</style>