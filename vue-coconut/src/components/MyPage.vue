<template>
        <div v-if="user">
            <h1>{{user.name}}님의 마이 페이지</h1>
            <p v-bind="user.money">잔액 : {{user.money.toLocaleString()}}원</p>
            <hr noshade/>
            <div class="AllProduct">
                <div class="row">
                    <div class="col-md-2">
                        <table class="table table-hover">
                            <tbody>
                            <tr class="table-success" v-if="Store.seller == 1">
                                <th scope="row" v-on:click="onCategory('all')">
                                    상품 관리
                                </th>
                            </tr>
                            <tr class="table-success" v-if="Store.seller == 1">
                                <th scope="row" v-on:click="onCategory('Create')">
                                    상품 등록
                                </th>
                            </tr>
                            <!--
                            <tr class="table-success">
                                <th scope="row" v-on:click="onCategory('change')">
                                    비밀번호 변경
                                </th>
                            </tr>
                            -->
                            <!--
                            <tr class="table-success">
                                <th scope="row" v-on:click="onCategory('receipt')">
                                    영수증
                                </th>
                            </tr>
                            -->
                            <tr class="table-success"  v-if="storeTF == false">
                                <th scope="row" v-on:click="onCategory('cart')">
                                    장바구니
                                </th>
                            </tr>
                            <tr class="table-success" >
                                <th scope="row" v-if="storeTF == false" v-on:click="onCategory('order')">
                                    주문/구매내역
                                </th>
                            </tr>
                            <tr class="table-success" v-if="storeTF == true">
                                <th scope="row" v-on:click="onCategory('sales')">
                                    판매 내역
                                </th>
                            </tr>
                            <tr class="table-success" >
                                <th scope="row" v-if="storeTF == false" v-on:click="onCategory('charge')">
                                    잔액 충전
                                </th>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="col-md-1"></div>
                    <div class="col-md-7">
                        <MyCategory v-bind:choice="choiceCategory"></MyCategory>
                        <ChangePassword v-bind:choice="choiceCategory"></ChangePassword>
                        <CreateStore v-bind:choice="choiceCategory"></CreateStore>
                        <Cart v-bind:choice="choiceCategory"></Cart>
                        <OrderView v-bind:choice="choiceCategory"></OrderView>
                        <SalesHistory v-bind:choice="choiceCategory"></SalesHistory>
                        <MoneyCharge v-bind:choice="choiceCategory"></MoneyCharge>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
    import MyCategory from "./MyCategory";
    import CreateStore from "./CreateStore";
    import ChangePassword from "./ChangePassword";
    import OrderView from "./OrderView";
    import SalesHistory from "./SalesHistory";
    import Cart from "./Cart";
    import MoneyCharge from "./MoneyCharge";

    export default {
        name: "MyPage",
        components : {
            MoneyCharge,
            SalesHistory,
            OrderView,
            MyCategory,
            CreateStore,
            ChangePassword,
            Cart
        },
        data () {
            return {
                user : {},
                storeTF : null,
                Store : {},
                choiceCategory : ''
            }
        },

        methods : {
            onCategory : function ( select ) {
                this.choiceCategory = select;
                console.log(this.choiceCategory);
            }
        },

        created() {
            this.$store.dispatch('GetProfile')
                .then( response => {
                    console.log('토큰검증 성공');
                    this.user = response.data.user;

                    if( response.data.user.indi == 0) {
                        let UserNumber = {
                            number : response.data.user.number
                        };
                        return this.$store.dispatch('FoundEnt', UserNumber);
                    } else {
                        this.storeTF = false;
                        console.log('기업 검증 실패');
                        //alert('기업 검증 실패');
                        //return '기업검증 실패';
                    }
                })
                .then( res => {
                    this.Store = res.data.store;
                    if (res.data.store.seller == 1) {
                        this.storeTF = true;
                        this.newStore.seller = res.data.store.company;
                        this.newStore.number = res.data.store.number;
                        console.log('판매자 검증 성공');
                    } else {
                        this.storeTF = false;
                        console.log('판매자 검증 실패');
                        //alert('판매자 검증 실패');
                    }
                })
                .catch( err => {
                    if(err == '기업검증 실패') {
                        this.storeTF = false;
                        console.log('검증 실패 err 1');
                    }
                    else if( (err.response.status === 401) || (err.response.status === 403) ) {
                        this.storeTF = false;
                        console.log('검증 실패' + JSON.stringify(err));
                        //this.$store.dispatch('LOGOUT');
                        //this.$router.replace({path : '/Login'});
                    } else {
                        this.storeTF = false;
                        console.log('검증 실패 err 2');
                    }
                })
        }
    }
</script>

<style scoped>

</style>