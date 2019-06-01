<template>
    <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
            <h2>사업자 판매 회원가입입니다</h2>
            <br><br>
                <input type="text" v-model="newSeller.id" class="form-control" placeholder="아이디">
                <small id="idHelp" class="form-text text-muted float-left">아이디는 6글자 이상이어야 합니다.</small>
                <br><br>
                <input type="password" v-model="newSeller.password" class="form-control" placeholder="비밀번호">
                <small id="passwordHelp" class="form-text text-muted float-left">비밀번호는 8글자 이상, 영문 대/소문자, 숫자, 특수문자가 포함되어야 합니다.</small>
                <br><br>
                <input type="text" v-model="newSeller.name" class="form-control" placeholder="이름">
                <br>
                <input type="text" v-model="newSeller.tel" class="form-control" placeholder="전화번호">
                <br>
                <input type="text" v-model="newSeller.addr" class="form-control" placeholder="주소">
                <br>
                <input type="text" v-model="newSeller.email" class="form-control" placeholder="이메일 abc@example.com">
                <br>
                <input type="text" v-model="newSeller.crn" class="form-control" placeholder="사업자 등록 번호">
                <small id="crnHelp" class="form-text text-muted float-left">사업자 번호 10자리를 입력해주세요</small>
                <br><br>
                <input type="text" v-model="newSeller.company" class="form-control" placeholder="회사이름">
                <br><br>
                <button @click="newSellerSubmit" type="button" class="btn btn-primary">회원가입</button>
        </div>
        <div class="col-md-3"></div>
    </div>
</template>

<script>
    var indi = 0;
    var seller = 1;
    export default {
        name: "RegisterEnterpriseSeller",
        data(){
            return {
                newSeller : {
                    id: '',
                    password: '',
                    name: '',
                    tel: '',
                    addr: '',
                    email: '',
                    crn: '',
                    company: '',
                    indi: indi,
                    seller: seller
                }
            }
        },
        methods : {
            newSellerSubmit : function () {
                let pathuser = {
                    path : '/users/registerEnt',
                    user : this.newSeller
                };
                this.$store.dispatch('REGISTER', pathuser)
                    .then( response => {
                        if(response.data.success == true) {
                            alert('Enterprise Seller user register Success');
                            console.log('Enterprise Seller user register Success');
                            this.$router.replace({ path : '/Login' });
                        } else {
                            alert('Enterprise Seller user register Failure');
                            console.log('Enterprise Seller user register Failure')
                        }
                    }).catch( err => {
                    console.log('Enterprise Seller user register Err : '+ err);
                });
            }
        }
    }
</script>

<style scoped>

</style>