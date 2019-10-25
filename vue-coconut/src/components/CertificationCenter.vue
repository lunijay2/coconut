<template>
        <div>
            <h2>인증 센터</h2>
            <hr noshade/>
            <br>
            <div class="card">
                <div class="card-body">
                    <h3 class="card-title">마스터 인증서 / 추가 인증서란?</h3>
                    <br>
                    <h5 class="card-text">
                        <strong>· </strong><strong style="color: red">마스터 인증서</strong> : 사용자당 <strong>하나만</strong> 소유가 가능한 인증서로, 해당 사용자의 <strong>모든 추가 인증서</strong>를 관리할 수 있습니다. 결제, 영수증 발급에 사용이 가능합니다.
                        <p></p>
                        <strong>· </strong><strong style="color: blue">추가 인증서</strong> : 사용자의 <strong>마스터 인증서로 발급</strong>한 인증서로, 발급 요청시 마스터 인증서가 저장된 기기에서 <strong>승인</strong>을 받아 사용할 수 있습니다. 결제, 영수증 발급에 사용이 가능합니다.
                    </h5>
                </div>
            </div>
            <br><br>
                <div class="card-deck">
                    <div class="card">
                        <div class="card-body">
                            <h3 class="card-title text-center">마스터 인증서 발급</h3>
                            <br>
                            <h6 class="card-text">
                                <p>· 처음 인증서를 발급받으려는 사용자</p>
                                <p>· 마스터 인증서 유효기간이 만료된 사용자</p>
                            </h6>
                        </div>
                        <div class="card-footer">
                            <router-link to="/Cert" class="nav-link">
                                <button type="button" class="btn btn-lg btn-primary col-md-12">마스터 인증서 발급</button>
                            </router-link>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h3 class="card-title text-center">추가 인증서 발급</h3>
                            <br>
                            <h6 class="card-text">
                                <p>· 마스터 인증서를 발급받은 사용자</p>
                                <p>· 추가 인증서 유효기간이 만료된 사용자</p>
                            </h6>
                        </div>
                        <div class="card-footer">
                            <router-link to="/AdditionalCert" class="nav-link">
                                <button type="button" class="btn btn-lg btn-success col-md-12">추가 인증서 발급</button>
                            </router-link>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h3 class="card-title text-center">인증서 관리</h3>
                            <br>
                            <h6 class="card-text">
                                <p>· 마스터 인증서를 사용해 추가 인증서를 승인, 폐기하려는 사용자</p>
                            </h6>
                        </div>
                        <div class="card-footer">
                            <router-link to="/CertManagement" class="nav-link">
                                <button type="button" class="btn btn-lg btn-info col-md-12">인증서 관리</button>
                            </router-link>
                        </div>
                    </div>
                </div>
                <!--
                <div class="card text-center col-md-4">
                    <div class="card-body">
                        <h3 class="card-title">마스터 인증서 발급</h3>
                        <br>
                        <h6 class="card-text">
                            <p>- 처음 인증서를 발급받으려는 사용자</p>
                            <p>- 마스터 인증서 유효기간이 만료된 사용자</p>
                        </h6>
                        <br>
                        <button @click="" type="button" class="btn btn-primary col-md-12">마스터 인증서 발급</button>
                    </div>
                </div>
                <div class="card text-center col-md-4">
                    <div class="card-body">
                        <h3 class="card-title">추가 인증서 발급</h3>
                        <br>
                        <h6 class="card-text">
                            <p>- 다른 기기에 마스터 인증서를 발급받은 사용자</p>
                            <p>- 스마트폰, 노트북 등 모바일 기기에서 인증서를 발급받으려는 사용자</p>
                            <p>- 추가 인증서 유효기간이 만료된 사용자</p>
                        </h6>
                        <br>
                        <button @click="" type="button" class="btn btn-lg btn-success col-md-12">추가 인증서 발급</button>
                    </div>
                </div>
                <div class="card text-center col-md-4">
                    <div class="card-body">
                        <h3 class="card-title">인증서 관리</h3>
                        <br>
                        <h6 class="card-text">
                            <p>- 마스터 인증서를 사용해 추가 인증서를 발급승인, 폐기</p>
                        </h6>
                        <br>
                        <button @click="" type="button" class="btn btn-lg btn-info col-md-12">인증서 관리</button>
                    </div>
                </div>
                -->
        </div>
</template>

<script>
    export default {
        name: "CertificationCenter"
    }
</script>

<style scoped>

</style>