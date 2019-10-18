<template>
    <from>
        <div class="row" v-if="choice == 'change'">

            <label for="password" class="col-sm-2 col-form-label">비밀번호</label>
            <div class="col-sm-10">
                <input type="password"  v-model="Password.password1" class="form-control" placeholder="Password">
            </div>
            <label for="password" class="col-sm-2 col-form-label">비밀번호 확인</label>
            <div class="col-sm-10">
                <input type="password"  v-model="Password.password2" class="form-control" placeholder="Password">
            </div>

            <button @click="onchangeSubmit" type="button" class="btn btn-primary">변경하기</button>
        </div>

    </from>
</template>

<script>
    export default {
        name: "ChangePassword",
        data(){
            return {
                user : {},
                Password : {
                    password1: '',
                    password2: ''
                }
            }
        },
        props: {
            choice : ''
        },
        methods : {
            onchangeSubmit() {
                const Password = this.Password;
                console.log('user:'+JSON.stringify(this.user));
                if (Password.password1 != Password.password2) {
                    console.log('빠꿀꺼다름:'+Password.password1, +Password.password2);
                    return alert('비밀번호가 같지 않다');
                } else {
                    console.log('빠꿀꺼같음:' + Password.password2);
                    let ChangePassword = {
                        Password: this.Password.password2,
                        number: this.user.number
                    };

                    this.$store.dispatch('ChangePass', ChangePassword)
                        .then(res => {
                            console.log('변경 성공 : ' + JSON.stringify(res));
                            alert('변경 성공');
                        })
                        .catch(err => {
                            console.log("Login Error! : ", err);
                            return alert('변경 실패' + err);
                        });
                }
            }
        },

        watch : {
            choice : function (category) {
                if ( category == 'change') {
                    this.$store.dispatch('GetProfile')
                        .then( response => {
                            console.log('토큰검증 성공');
                            this.user = response.data.user;})
                }
                else {
                    console.log('안왔다: ');
                }

            }
        }
    }


</script>

<style scoped>

</style>