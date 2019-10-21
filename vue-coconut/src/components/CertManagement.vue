<template>
    <div v-if="allow == true">
        <h2>인증서 관리</h2>
        <hr noshade/>
        <table class="table">
            <thead>
            <tr class="table-active">
                <th scope="col">기기 이름</th>
                <th scope="col" style="width: 25%">발급 승인</th>
                <th scope="col" style="width: 22%">상태</th>
                <th scope="col" style="width: 22%">작업</th>
            </tr>
            </thead>
            <tbody v-for="(cert, index) in AdditionalCert">
            <tr>
                <td><h5><strong>{{cert.deviceID}}</strong></h5></td>
                <td>
                    <h5 v-if="cert.allowed == 0" v-bind="cert.allowed">
                        <button @click="choiceAllowSubmit(index)" type="button" class="btn btn-primary">발급 승인</button>
                    </h5>
                    <h5 v-if="cert.allowed == 1">
                        <button type="button" class="btn btn-success" disabled>발급 완료</button>
                    </h5>
                </td>
                <td>
                    <h5 v-if="cert.allowed == 0">
                        <button type="button" class="btn btn-danger" disabled>발급 승인 필요</button>
                    </h5>
                    <h5 v-if="cert.disable == 0 && cert.allowed == 1">
                        <button type="button" class="btn btn-success" disabled>활성화됨</button>
                    </h5>
                    <h5 v-if="cert.disable == 1 && cert.allowed == 1">
                        <button type="button" class="btn btn-danger" disabled>비활성화됨</button>
                    </h5>
                </td>
                <td>
                    <h5 v-if="cert.disable == 0 && cert.allowed == 1">
                        <button @click="CertDisableSubmit(cert)" type="button" class="btn btn-danger">비활성화</button>
                    </h5>
                    <h5 v-if="cert.disable == 1 && cert.allowed == 1">
                        <button @click="CertAbleSubmit(cert)" type="button" class="btn btn-success">활성화</button>
                    </h5>
                </td>
            </tr>
            <tr v-if="(choiceAllow == true) && (choiceIndex == index)">
                <td colspan="4" >
                    <div>
                        <div class="alert alert-warning" role="alert">
                            <h3 class="page-header">마스터 인증서 비밀번호 입력</h3>
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" class="form-control" v-model="Cpass" name="password">
                            </div>
                            <button @click="CertAllow(cert)" type="button" class="btn btn-primary align-self-center">발급 승인</button>
                        </div>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    <!--
    <div class="row">
        <div class="col-md-2"></div>
        <div class="col-md-8">
            <h2>인증서 관리</h2>
            <hr noshade/>

        </div>
        <div class="col-md-2"></div>
    </div>
    -->
</template>

<script>
    export default {
        name: "CertManagement",
        data(){
            return {
                AdditionalCert : [],
                user : {},
                choiceAllow : Boolean,
                choiceIndex : null,
                Cpass : '',
                allow : false
            }
        },
        created() {
            this.$store.dispatch('GetProfile')
                .then( response => {
                    //console.log('토큰검증 성공'+JSON.stringify(response.data.user));
                    console.log('토큰검증 성공');
                    this.user = response.data.user;

                    //마스터 인증서가 맞으면 추가인증서 목록 반환
                    return this.$store.dispatch('CheckMasterCert', this.user)
                })
                .then( response => {
                    console.log('response.data : '+JSON.stringify(response.data));
                    if (response.data.success == true) {
                        this.AdditionalCert = response.data.result;
                        this.allow = true;
                    } else {
                        console.log('CheckMasterCert false 1 : ');
                    }
                })
                .catch( err => {
                    console.log('CheckMasterCert err 1 : ' + err);
                    alert('마스터 인증서 소유자가 아닙니다.');
                    this.$router.replace({path : '/CertificationCenter'})
                    //this.$store.dispatch('LOGOUT');
                    //this.$router.replace({path : '/Login'});
                });
        },
        methods : {
            CertAllow : function (cert) {
                var certR = {
                    cert : cert,
                    user : this.user,
                    pa : this.Cpass
                };
                console.log('select cert : '+JSON.stringify(cert));

                this.$store.dispatch('AddCertAllow', certR)
                    .then( response => {
                        console.log('response 1 : '+JSON.stringify(response));
                        if (response.data.success == true) {
                            alert('승인되었습니다');
                            return this.$store.dispatch('CheckMasterCert', this.user)
                        } else {
                            console.log('AddCertAllow false 1 : ');
                        }
                    })
                    .then( response => {
                        console.log('response 2 : '+JSON.stringify(response));
                        if (response.data.success == true) {
                            this.AdditionalCert = response.data.result;
                            this.choiceAllow = false;
                            this.choiceIndex = null;
                        } else {
                            console.log('AddCertAllow false 2 : ');
                        }
                    })
                    .catch( err => {
                        console.log('AddCertAllow err : '+err);
                    })
            },
            choiceAllowSubmit : function (index) {
                if ( this.choiceIndex == index ) {
                    if (this.choiceAllow == true ) {
                        this.choiceAllow = false;
                    } else {
                        this.choiceAllow = true;
                    }
                } else {
                    this.choiceAllow = true;
                }
                this.choiceIndex = index;
                this.Cpass = '';
                console.log('index : '+this.choiceIndex);
            },
            CertDisableSubmit : function (cert) {
                var certDR = {
                    cert : cert,
                    user : this.user
                };
                console.log('select cert : '+JSON.stringify(certDR));

                this.$store.dispatch('AddCertDisable', certDR)
                    .then( response => {
                        if (response.data.success == true) {
                            alert('비활성화되었습니다');
                            return this.$store.dispatch('CheckMasterCert', this.user)
                        } else {
                            console.log('AddCertDisable false 1 : ');
                        }
                    })
                    .then( response => {
                        console.log('response 2 : '+JSON.stringify(response));
                        if (response.data.success == true) {
                            this.AdditionalCert = response.data.result;
                        } else {
                            console.log('AddCertDisable false 2 : ');
                        }
                    })
                    .catch( err => {
                        console.log('AddCertDisable err : '+err);
                    })
            },
            CertAbleSubmit : function (cert) {
                var certDR = {
                    cert : cert,
                    user : this.user
                };
                console.log('select cert : '+JSON.stringify(certDR));

                this.$store.dispatch('AddCertAble', certDR)
                    .then( response => {
                        if (response.data.success == true) {
                            alert('활성화되었습니다');
                            return this.$store.dispatch('CheckMasterCert', this.user)
                        } else {
                            console.log('AddCertAble false 1 : ');
                        }
                    })
                    .then( response => {
                        console.log('response 2 : '+JSON.stringify(response));
                        if (response.data.success == true) {
                            this.AdditionalCert = response.data.result;
                        } else {
                            console.log('AddCertAble false 2 : ');
                        }
                    })
                    .catch( err => {
                        console.log('AddCertAble err : '+err);
                    })
            }
        },
    }
</script>

<style scoped>

</style>