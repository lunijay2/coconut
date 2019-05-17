<template>
    <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
            <h2>사업자 구매 회원 가입입니다</h2>
            <br><br>
            <form @submit="newUserSubmit">
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
                <br>

                <input type="number" v-model="newUser.crn" class="form-control" placeholder="사업자 등록번호">
                <small id="crnHelp" class="form-text text-muted float-left">사업자 번호 10자리를 입력해주세요.</small>
                <br><br>
                <input type="text" v-model="newUser.company" class="form-control" placeholder="상호명">
                <br><br>
                <button type="submit" class="btn btn-primary">회원가입</button>
            </form>
        </div>
        <div class="col-md-3"></div>
    </div>
</template>

<script>
    var indi = 0;
    var seller = 0;
    export default {
        name: "RegisterEnterpriseBuyer",
        data(){
            return {
                newUser : {
                    id: '',
                    password: '',
                    name: '',
                    tel: '',
                    addr: '',
                    email: '',
                    indi: indi,
                    crn: '',
                    company: '',
                    seller: seller
                }
            }
        },
        methods : {
            newUserSubmit : function () {
                this.$axios.post('http://localhost:3000/users/registerEnt', this.newUser )
                    .then((response) => {
                        if(response.data.success == true) {
                            alert('사업자 구매회원 가입 성공');
                            console.log('사업자 구매회원 가입 성공');
                        } else {
                            alert('사업자 구매회원 가입 실패(에러없음)');
                            console.log('사업자 구매회원 가입 실패(에러없음)')
                        }
                    }). catch((err) => {
                    console.log("Error! : ", err);
                    console.log('사업자 구매회원 가입 실패');
                })
            }
        }
    }
</script>

<style scoped>

</style>

