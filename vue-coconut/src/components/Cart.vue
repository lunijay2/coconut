<template>
    <from>
        <div class="list-group" v-if="choice == 'cart'">
            <h2>장바구니</h2>
            <br>
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
                    <td>
                        <div class="media">
                            <router-link :to="'/DetailProduct/'+cart.productcode" class="nav-link">
                                <img :src="cart.imageBlob" class="align-self-start mr-3 widthSet heightSet" />
                            </router-link>
                            <!--
                            <img v-bind:src='cart.thumbnail' class="align-self-start mr-3 widthSet heightSet" />-->
                            <div class="media-body">
                                <h6 class="mt-0">
                                    <router-link :to="'/DetailProduct/'+cart.productcode" class="nav-link" style="color: black;">{{cart.productname}}</router-link>
                                </h6>
                            </div>
                        </div>
                    </td>
                    <td>{{(cart.price*cart.quantity).toLocaleString()}}원</td>
                    <td>{{cart.quantity}}개</td>
                    <td>{{cart.seller}}</td>
                    <td>
                        <div class="custom-control custom-checkbox">
                            <input class="form-check-input" v-model="cart.check" type="checkbox" value="1">
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
            <div>
                <button @click="CreateOrderSubmit" type="button" class="btn btn-block btn-lg btn-primary">바로구매</button>
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
                carts : {},
                temp : {},
                //lnk : 'http://localhost:3000/img/',
                lnk : "/img/"
            }
        },
        props: {
            choice : ''
        },
        watch : {
            choice : function (category) {
                if ( category == 'cart') {
                    this.$store.dispatch('GetProfile')
                        .then( response => {
                            console.log('토큰검증 성공');
                            this.user = response.data.user;

                            let UserNumber = {
                                number : this.user.id
                            };
                            console.log(JSON.stringify(UserNumber));
                            return this.$store.dispatch('GetCart', UserNumber)
                        })
                        .then( response => {
                            //console.log('가지고 온거 : '+JSON.stringify(response.data.store));
                            this.temp = response.data.store;

                            let pp = '';
                            for (let i=0; i<response.data.store.length; i++) {
                                if(i==0){
                                    pp = response.data.store[i].productcode;
                                } else {
                                    pp = pp+'/'+response.data.store[i].productcode;
                                }
                            }
                            console.log('pp: '+pp);
                            let p = {
                                productcode : pp
                            };
                            if ( (JSON.stringify(p).indexOf('/')) !== -1) {
                                return this.$store.dispatch('GetProductDetail3', p);
                            } else {
                                return this.$store.dispatch('GetProductDetail', p);
                            }
                        })
                        .then( response => {
                            //console.log('res : '+JSON.stringify(response.data.result));
                            this.imglnk(response.data.result);
                            this.carts = this.temp;
                            //console.log('carts : '+JSON.stringify(this.carts));
                        });
                }
            }
        },
        methods : {
            imglnk : function (res) {
                for (let i=0; i<this.temp.length; i++) {
                    for (let j=0; j<res.length; j++) {
                        if(this.temp[i].productname == res[j].productname) {
                            //this.temp[i].thumbnail = this.lnk+res[j].thumbnail;
                            var bytes = new Uint8Array(res[j].image.data);
                            var blob = new Blob([bytes], {type:'image/png'});
                            this.temp[i].imageBlob = URL.createObjectURL(blob);
                        }
                        console.log(i +'+'+j);
                    }
                }
            },
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
    .widthSet {
        max-width: 40px;
    }
    .heightSet {
        max-height: 40px;
    }

    @media
    only screen
    and (max-width: 768px), (min-device-width: 768px)
    and (max-device-width: 1024px)  {

        /* Force table to not be like tables anymore */
        table, thead, tbody, th, td, tr {
            display: block;
        }

        /* Hide table headers (but not display: none;, for accessibility) */
        thead tr {
            position: absolute;
            top: -9999px;
            left: -9999px;
        }

        tr {
            margin: 0 0 1rem 0;
        }

        tr:nth-child(odd) {
            background: #ccc;
        }

        td {
            /* Behave  like a "row" */
            border: none;
            border-bottom: 1px solid #eee;
            position: relative;
            padding-left: 50%;
        }

        td:before {
            /* Now like a table header */
            position: absolute;
            /* Top/left values mimic padding */
            top: 0;
            left: 6px;
            width: 45%;
            padding-right: 10px;
            white-space: nowrap;
        }

        /*
        Label the data
    You could also use a data-* attribute and content for this. That way "bloats" the HTML, this way means you need to keep HTML and CSS in sync. Lea Verou has a clever way to handle with text-shadow.
        */
        td:nth-of-type(1):before { content: "상품정보"; }
        td:nth-of-type(2):before { content: "금액"; }
        td:nth-of-type(3):before { content: "수량"; }
        td:nth-of-type(4):before { content: "판매자"; }
        td:nth-of-type(5):before { content: "선택"; }
    }

</style>