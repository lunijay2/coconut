<template>
    <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
            <input type="text" v-model="newUser.id" class="form-control" placeholder="ID" value="email@example.com">
            <small id="idHelp" class="form-text text-muted float-left">아이디는 6글자 이상이어야 합니다.</small>
            <br><br>
            <input type="password" v-model="newUser.password" class="form-control" placeholder="Password">
            <small id="passwordHelp" class="form-text text-muted float-left">비밀번호는 8글자 이상, 영문 대/소문자, 숫자, 특수문자가 포함되어야 합니다.</small>
            <br><br><br>
            <button type="submit" class="btn btn-primary">로그인</button>
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