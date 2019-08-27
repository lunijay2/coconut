<template>
    <from>

        <div>
            <h1>마이 페이지입니다.</h1>

            <div class="col-md-1"></div>
            <div class="col-md-2">
                <table class="table table-hover">
                    <tbody>
                    <tr class="table-success">
                        <th scope="row">
                            <router-link to="/ChoiceMemberType" >
                                정보관리
                            </router-link>
                        </th>
                    </tr>

                    <tr class="table-success">
                        <th scope="row" >
                            <rlink><router-link to="/ChoiceMemberType" >
                                주문관리
                            </router-link></rlink>
                        </th>
                    </tr>

                    <tr class="table-success" v-if="Store.seller == 1">
                        <th scope="row" >
                            <router-link to="/CreateStore" >
                                상품관리
                            </router-link>
                        </th>
                    </tr>

                    </tbody>
                </table>
            </div>
            <div>
                <li><router-link to="/CreateStore" >
                    상품등록
                </router-link></li>
                <li><router-link to="/MyProduct" >
                    등록한 상품 보기
                </router-link></li>
                <li><router-link to="/CreateStore" >
                    비밀번호 변경
                </router-link></li>
                <li><router-link to="/CreateStore" >
                    영수증 확인
                </router-link></li>

            </div>



            <div class="card text-white bg-primary mb-3" style="max-width: 20rem;" v-if="user.name">
                <div class="card-header">{{ user.name }}님 환영합니다.</div>
                <div class="card-body">
                    <h4 class="card-title">{{user}}</h4>
                    <p class="card-text">{{Store}}</p>
                </div>
            </div>

        </div>
    </from>
</template>

<script>
    export default {
        name: "MyPage",
        data () {
            return {
                user : {},
                Store : {}
            }
        },

        created() {
            this.$store.dispatch('GetProfile')
                .then( response => {
                    //alert('토큰검증 성공 : '+JSON.stringify(response.data.user));
                    console.log('토큰검증 성공');
                    this.user = response.data.user;
                    //console.log('response : '+JSON.stringify(response));
                    if( 0 == response.data.user.indi) {
                        let UserNumber = {
                            number : response.data.user.number
                        };
                        return this.$store.dispatch('FoundEnt', UserNumber);
                    } else {
                        console.log('기업 검증 실패 : ');
                        alert('기업 검증 실패');
                        return '기업검증 실패';
                        //this.$store.dispatch('LOGOUT');
                        //this.$router.replace({path : '/Login'});
                    }
                })
                .then( res => {
                    this.Store = res.data.store
                    //console.log('res : '+JSON.stringify(res));
                    if (res.data.store.seller === 1) {
                        this.newStore.seller = res.data.store.company;
                        this.newStore.number = res.data.store.number;

                        console.log('판매자 검증 성공');
                    } else {
                        console.log('판매자 검증 실패');
                        alert('판매자 검증 실패');
                        //this.$store.dispatch('LOGOUT');
                        //this.$router.replace({path : '/Login'});
                    }
                })
                .catch( err => {
                    //console.log('검증 실패' + JSON.stringify(err));
                    //alert(err);
                    if(err == '기업검증 실패') {
                        console.log('검증 실패 err 1');
                    }
                    else if(err.response.status === 401) {
                        console.log('검증 실패' + JSON.stringify(err));
                        this.$store.dispatch('LOGOUT');
                        this.$router.replace({path : '/Login'});
                    } else {
                        console.log('검증 실패 err 2');
                    }
                })
        }

    }
</script>

<style scoped>
    a{
        text-decoration: none;
        color: #2c3e50;

    }
</style>