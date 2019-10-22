<template>
    <div class="row" v-if="user.id">
        <div class="col-md-3"></div>
        <div class="col-md-6">
            <div class="row">
                <h2>추가 인증서 발급</h2>
                <br><br><br>
                <div class="card col-md-11">
                    <div class="card-body">
                        <h5 class="card-text">
                            <p>
                                <strong>추가 인증서</strong>는 발급 요청 후, 마스터 인증서 기기에서 승인을 받은 뒤 사용이 가능합니다.
                            </p>
                            <strong>추가 인증서</strong>는 제한없이 소유가 가능합니다.
                        </h5>
                    </div>
                </div>
            </div>
            <br>
            <div class="row" v-if="tempCert.cert">
                <div class="card col-md-11">
                    <div class="card-body">
                        <div v-if="(tempCert.allowed == 0) && (tempCert.disable == 1)">
                            <h4 class="card-title">
                                <strong>발급 승인 대기 중인 추가 인증서</strong></h4>
                            <h5 class="card-text">
                                <strong>▶ 기기명 : {{tempCert.deviceID}}</strong>
                            </h5>
                        </div>
                        <div v-if="(tempCert.allowed == 1) && (tempCert.disable == 0)">
                            <h4 class="card-title"><strong>발급 승인 완료된 추가 인증서</strong></h4>
                            <br>
                            <h5 class="card-text">
                                <p>
                                    <strong>▶ 기기명 : {{tempCert.deviceID}}</strong>
                                    <br><br>
                                    <button @click="AddCertIssue" type="button" class="btn btn-primary btn-block">발급</button>
                                </p>
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
            <br><br>
            <div class="row">
                <h6>기기 이름 입력</h6>
                <input type="text" v-model="deviceId" aria-describedby="DeviceHelp" class="form-control col-md-11" placeholder="기기 이름">
                <h5 class="col-md-11"><small id="DeviceHelp" class="form-text text-muted">현재 사용하는 기기의 별명이나 명칭을 입력하세요. 다른 인증서와의 구분에 사용됩니다.</small><br></h5>
                <h6>추가 인증서 비밀번호 입력</h6>
                <input type="password" v-model="p" class="form-control col-md-11" placeholder="비밀번호">
                <br><br><br>
                <h6>추가 인증서 비밀번호 확인</h6>
                <input type="password" v-model="c" class="form-control col-md-11" placeholder="비밀번호 확인">
                <h3 v-if="m.co == true" style="color:green;" class="col-md-1">✔</h3>
                <h2 v-if="m.co == false" style="color:red;" class="float-left">&nbsp;✘</h2>
                <br><br><br><br>
                <button @click="AddCertSubmit" type="button" class="btn btn-primary col-md-11">추가 인증서 발급</button>
            </div>
            <br><br><br>
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
        name: "AdditionalCert",
        data(){
            return {
                deviceId : '',
                p : '',
                c : '',
                m : {
                    me : '',
                    co : Boolean
                },
                user : {},
                tempCert : {},
            }
        },
        created() {
            this.$store.dispatch('GetProfile')
                .then( response => {
                    //console.log('토큰검증 성공'+JSON.stringify(response.data.user));
                    console.log('토큰검증 성공');
                    this.user = response.data.user;

                    return this.$store.dispatch('AddCertAllowCheck', this.user);
                }, err => {
                    console.log('검증 실패' + err);
                    this.$store.dispatch('LOGOUT');
                    this.$router.replace({path : '/Login'});
                })
                .then( response => {
                    console.log('AddCertAllowCheck response : '+JSON.stringify(response));
                    this.tempCert = response.data.result[0];
                })
                .catch( err => {
                    console.log('검증 에러' + err);
                    //this.$store.dispatch('LOGOUT');
                    //this.$router.replace({path : '/Login'});
                });
        },
        methods : {
            AddCertSubmit : function () {
                if ( (this.p == this.c ) && (this.m.co == true) ) {

                    let certVal = {
                        user : this.user,
                        deviceId: this.deviceId
                    };

                    this.$store.dispatch('AddCert04', certVal)
                        .then( response => {
                            console.log('AddCert04 : '+JSON.stringify(response));
                            if (response.data.success == true) {
                                let certR = {
                                    pa : this.p,
                                    user : this.user,
                                    deviceId: this.deviceId
                                };
                                return this.$store.dispatch('AddCertRequest', certR);
                            } else {
                                console.log('AddCert04 Validate false');
                                alert('중복된 기기 이름은 사용할 수 없습니다.');
                                this.deviceId = '';
                                this.p = '';
                                this.c = '';
                            }
                        })
                        .then( response => {
                            if(response.data.success == true) {
                                console.log('Cert Request 1 : '+JSON.stringify(response));
                                var re = {
                                    response : response.data,
                                    id : this.user.id,
                                    deviceId : this.deviceId
                                };
                                this.$store.dispatch('storeACert', re);
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
            },
            AddCertIssue : function () {
                var issue = {
                    cert : this.tempCert.cert,
                    user : this.user
                };
                this.$store.dispatch('storeACertissue', issue);
                alert('추가 인증서가 발급되었습니다.');
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
