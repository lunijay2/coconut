<template>
        <div class="row" v-if="user.id">
            <div class="col-md-3"></div>
            <div class="col-md-6">
                <h2>인증서 발급</h2><br>
                <input type="password" v-model="p" class="form-control" placeholder="비밀번호">
                <p></p>
                <input type="password" v-model="c" class="form-control" placeholder="비밀번호 확인">
                <p></p>
                <h5 v-if="m.co == true" style="color:green;" class="float-left">{{m.me}}</h5>
                <h5 v-if="m.co == false" style="color:red;" class="float-left">{{m.me}}</h5>
                <br>
                <button @click="newCertSubmit" type="button" class="btn btn-primary">인증서 발급</button>
            </div>
            <div class="col-md-3"></div>
        </div>
</template>

<script>
    export default {
        name: "Cert",
        data(){
            return {
                p : '',
                c : '',
                m : {
                    me : '',
                    co : Boolean
                },
                user : {}
            }
        },
        created() {
            this.$store.dispatch('GetProfile')
                .then( response => {
                    //console.log('토큰검증 성공'+JSON.stringify(response.data.user));
                    console.log('토큰검증 성공');
                    this.user = response.data.user;
                }, err => {
                    console.log('검증 실패' + err);
                    this.$store.dispatch('LOGOUT');
                    this.$router.replace({path : '/Login'});
                })
                .catch( err => {
                    console.log('검증 에러' + err);
                    this.$store.dispatch('LOGOUT');
                    this.$router.replace({path : '/Login'});
                });
        },
        methods : {
            newCertSubmit : function () {
                if ( (this.p == this.c ) && (this.m.co == true) ) {
                    let certR = {
                        pa : this.p,
                        user : this.user
                    };
                    this.link = './'+this.user.id+'pem.txt';
                    this.$store.dispatch('certRequest', certR)
                        .then( response => {
                            if(response.data.success == true) {
                                console.log('Cert Request 1 : '+JSON.stringify(response));
                                var re = {
                                    response : response.data,
                                    id : this.user.id
                                };
                                this.$store.dispatch('storeMCert', re);
                                alert('Cert Request Success');
                                console.log('Cert Request Success');
                            } else {
                                this.$store.dispatch('deletePem', certR);
                                console.log('Cert Request Failure');
                                alert('Cert Request Failure');
                            }
                        }).catch( err => {
                        console.log('Cert Request Err : '+ err);
                    });
                }
                else {
                    alert('인증서 비밀번호를 확인해주세요');
                }
            }
        },
        watch : {
            p : function (pa) {
                if ( this.c == '' ) {

                }
                else if ( pa == this.c ) {
                    this.m.co = true;
                    this.m.me = '일치합니다';
                } else {
                    this.m.co = false;
                    this.m.me = '일치하지 않습니다.';
                }
            },
            c : function (confirm) {
                if ( confirm == this.p ) {
                    this.m.co = true;
                    this.m.me = '일치합니다';
                } else {
                    this.m.co = false;
                    this.m.me = '일치하지 않습니다.';
                }
            }
        }
    }
</script>

<style scoped>

</style>