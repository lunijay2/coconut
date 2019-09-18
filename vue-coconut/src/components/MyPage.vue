<template>
        <div v-if="user">
            <h1>{{user.name}}님의 마이 페이지</h1>
            <hr noshade/>
            <div class="AllProduct">
                <div class="row">
                    <div class="col-md-2">
                        <table class="table table-hover">
                            <tbody>
                            <tr class="table-success" v-if="Store.seller == 1">
                                <th scope="row" v-on:click="onCategory('all')">
                                    모든 상품
                                </th>
                            </tr>
                            <tr class="table-success">
                                <th scope="row" v-on:click="onCategory('change')">
                                    비밀번호 변경
                                </th>
                            </tr>
                            <tr class="table-success">
                                <th scope="row" v-on:click="onCategory('receipt')">
                                    영수증
                                </th>
                            </tr>
                            <tr class="table-success">
                                <th scope="row" v-on:click="onCategory('cart')">
                                    장바구니
                                </th>
                            </tr>
                            <tr class="table-success" >
                                <th scope="row" v-on:click="onCategory('order')">
                                    주문내역
                                </th>
                            </tr>
                            <tr class="table-success" v-if="Store.seller == 1">
                                <th scope="row" v-on:click="onCategory('Create')">
                                    상품등록
                                </th>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="col-md-1"></div>
                    <div class="col-md-7">
                        <p>잔액 : {{user.money.toLocaleString()}}원</p>
                        <MyCategory v-bind:choice="choiceCategory"></MyCategory>
                        <ChangePassword v-bind:choice="choiceCategory"></ChangePassword>
                        <CreateStore v-bind:choice="choiceCategory"></CreateStore>
                        <Cart v-bind:choice="choiceCategory"></Cart>
                        <OrderView v-bind:choice="choiceCategory"></OrderView>
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
    import Cart from "./Cart";

    export default {
        name: "MyPage",
        components : {
            OrderView,
            MyCategory,
            CreateStore,
            ChangePassword,
            Cart
        },
        data () {
            return {
                user : {},
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
                        console.log('기업 검증 실패 : ');
                        //alert('기업 검증 실패');
                        //return '기업검증 실패';
                    }
                })
                .then( res => {
                    this.Store = res.data.store;
                    if (res.data.store.seller == 1) {
                        this.newStore.seller = res.data.store.company;
                        this.newStore.number = res.data.store.number;

                        console.log('판매자 검증 성공');
                    } else {
                        console.log('판매자 검증 실패');
                        //alert('판매자 검증 실패');
                    }
                })
                .catch( err => {
                    if(err == '기업검증 실패') {
                        console.log('검증 실패 err 1');
                    }
                    else if(err.response.status === 401) {
                        console.log('검증 실패' + JSON.stringify(err));
                        //this.$store.dispatch('LOGOUT');
                        //this.$router.replace({path : '/Login'});
                    } else {
                        console.log('검증 실패 err 2');
                    }
                })
        }
    }
</script>

<style scoped>

</style>