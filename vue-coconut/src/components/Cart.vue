<template>
    <from>
        <div class="list-group" v-if="choice == 'cart'">
            <table class="table">
                <thead>
                <tr class="table-active">
                    <th scope="col">상품정보</th>
                    <th scope="col">금액</th>
                    <th scope="col">수량</th>
                    <th scope="col">판매자</th>
                    <th scope="col">선택</th>
                </tr>
                </thead>
                <tbody v-for="cart in carts">
                <tr>
                    <td><router-link :to="'/DetailProduct/'+cart.productcode" class="nav-link">{{cart.productname}}</router-link></td>
                    <td>{{(cart.price*cart.quantity)}}</td>
                    <td>{{cart.quantity}}개</td>
                    <td>{{cart.seller}}</td>
                    <div class="custom-control custom-checkbox">
                        <input class="form-check-input" v-model="cart.check" type="checkbox" value="1">
                    </div>
                </tr>
                </tbody>

            </table>
            <div>
                <td width="200px">
                    <button @click="CreateOrderSubmit" type="button" class="btn btn-block btn-lg btn-primary">바로구매</button>
                </td>
            </div>
            <!--
                        <div v-for="cart in carts">
                            <div class="custom-control custom-checkbox">
                                <input class="form-check-input" v-model="cart.check" type="checkbox" value="1" checked="">
                            </div>
                            <a class="list-group-item list-group-item-action flex-column align-items-start">
                                <div class="d-flex w-100 justify-content-between">
                                    <h5 class="mb-1">
                                        <router-link :to="'/DetailProduct/'+cart.productcode" class="nav-link">
                                            {{cart.productname}}
                                        </router-link>
                                    </h5>
                                    <small class="text-muted">{{cart.quantity}}개</small>
                                </div>
                                <p class="mb-1">{{cart.seller}}</p>

                                <small class="text-muted">그냥{{cart.price}}원 합계 {{cart.quantity*cart.price}}</small>
                            </a>
                            <br>
                            <p>{{cart.number}}</p>
                            <div>
                                <td width="200px">
                                    <button @click="CreateOrderSubmit" type="button" class="btn btn-block btn-lg btn-primary">바로구매</button>
                                </td>
                            </div>
                        </div>-->
        </div>
    </from>
</template>

<script>
    export default {
        name: "Cart",

        data() {
            return {
                user : {},
                carts : {}

            }
        },

        props: {
            choice : ''
        },

        created() {
            this.$store.dispatch('GetProfile')
                .then( response => {
                    console.log('토큰검증 성공');
                    this.user = response.data.user;});
        },

        watch : {
            choice : function (category) {
                if ( category == 'cart') {
                    console.log('왔다 : '+category);
                    let UserNumber = {
                        number : this.user.id
                    };
                    console.log(JSON.stringify(UserNumber));
                    this.$store.dispatch('GetCart', UserNumber)
                        .then( response => {
                            console.log('가지고 온거 : '+JSON.stringify(response.data.store));
                            this.carts = response.data.store;});
                }
                else {
                    console.log('안왔다: ');
                }
            }
        },
        methods : {

            CreateOrderSubmit : function () {

                //['1+1+1+1', '2+4+5+0']
                try {
                    var arr = [];
                    for(var io=0; io<100; io++) {
                        console.log('carts : '+JSON.stringify(this.carts[io]));
                        var a = String(this.carts[io].number);
                        var b = String(this.carts[io].productcode);
                        var c = String(this.carts[io].quantity);
                        var d = String(this.carts[io].check);

                        if((this.carts[io].check == true) || (this.carts[io].check == 1)) {
                            console.log('ab : '+JSON.stringify(arr));
                            var ab = String(b+'&'+c);
                            arr.push(ab);
                            console.log('ab2 : '+JSON.stringify(arr));
                        } else {
                            a = '';
                            b = '';
                            c = '';
                            d = '';
                        }
                    }
                } catch (e) {
                    console.log(e);
                } finally {
                    this.$router.push({ path : '/CreateOrder/'+0+'/'+arr});
                    console.log('arr : '+JSON.stringify(arr));
                    //JSON.stringify(this.carts)});
                }

            }

        }
    }
</script>

<style scoped>

</style>