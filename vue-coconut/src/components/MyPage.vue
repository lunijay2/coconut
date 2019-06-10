<template>
    <div>
        <h1>마이 페이지입니다.</h1>

        <div class="card text-white bg-primary mb-3" style="max-width: 20rem;" v-if="user.name">
            <div class="card-header">{{ user.name }}님 환영합니다.</div>
            <div class="card-body">
                <h4 class="card-title">이    름 : {{user.name}}</h4>
                <h4 class="card-title">전화번호 : {{user.tel}}</h4>
                <h4 class="card-title">주    소 : {{user.addr}}</h4>
                <h4 class="card-title">이 메 일 : {{user.email}}</h4>
                <h4 class="card-title">계    좌 : {{user.account}}</h4>
                <h4 class="card-title">잔    액 : {{user.money}}</h4>
                <br>
                <h3 class="card-text" v-if="Store">상호명 : {{Store.company}}</h3>
            </div>
        </div>

        <div v-if="Store.seller == 1">
            <router-link to="/CreateStore" class="nav-link">
                <button type="button" class="btn btn-primary">상품 등록</button>
            </router-link>
        </div>
    </div>
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
        methods:{
            onSubmit() {
                this.$store.dispatch('GetProfile')
                    .then( response => {
                        //alert('토큰검증 성공 : '+JSON.stringify(response.data.user));
                        console.log('토큰검증 성공');
                        this.user = response.data.user;
                        //console.log('this.name : '+JSON.stringify(this.user));
                    })
                    .catch( err => {
                        console.log('검증 실패' + err);
                        alert(err);
                        this.$router.replace({path : '/Login'});
                    })
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

</style>