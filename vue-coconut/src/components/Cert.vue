<template>
        <div class="row" v-if="user.id">
            <div class="col-md-3"></div>
            <div class="col-md-6">
                <div class="row">
                <h2>마스터 인증서 발급</h2>
                <br><br><br>
                <div class="card col-md-11">
                    <div class="card-body">
                        <h5 class="card-text">
                            <p>
                                <strong>마스터 인증서</strong>는 <strong>하나만</strong> 소유가 가능합니다.
                            </p>
                            <strong>마스터 인증서</strong>는 사용자의 <strong>모든 추가 인증서</strong>를 관리할 수 있습니다.
                        </h5>
                    </div>
                </div>
            </div>
                <br><br>
                <div class="row">
                    <h6>마스터 인증서 비밀번호 입력</h6>
                    <input type="password" v-model="p" class="form-control col-md-11" placeholder="비밀번호">
                    <br><br><br>
                    <h6>마스터 인증서 비밀번호 확인</h6>
                    <input type="password" v-model="c" class="form-control col-md-11" placeholder="비밀번호 확인">
                    <h3 v-if="m.co == true" style="color:green;" class="col-md-1">✔</h3>
                    <h2 v-if="m.co == false" style="color:red;" class="float-left">&nbsp;✘</h2>
                    <br><br><br><br>
                    <button @click="newCertSubmit" type="button" class="btn btn-primary col-md-11">마스터 인증서 발급</button>
                </div>
                <!--
                <h6 v-if="m.co == true" style="color:green;" class="float-left">✔</h6>
                <h6 v-if="m.co == false" style="color:red;" class="float-left">{{m.me}}</h6>
                <br><br>
                -->

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
                    //this.link = './'+this.user.id+'pem.txt';
                    this.$store.dispatch('certRequest', certR)
                        .then( response => {
                            if(response.data.success == true) {
                                console.log('Cert Request 1 : '+JSON.stringify(response));
                                var re = {
                                    response : response.data,
                                    id : this.user.id
                                };
                                this.$store.dispatch('storeMCert', re);
                                alert('마스터 인증서 발급 완료');
                                console.log('Cert Request Success');
                                this.$router.replace({path : '/CertificationCenter'});
                            } else {
                                this.$store.dispatch('deletePem', certR);
                                console.log('Cert Request Failure');
                                alert('마스터 인증서 발급에 실패했습니다');
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