<template>
    <div class="list-group" v-if="choice == 'order'">
        <h2>주문/구매내역</h2>
        <br>
        <div v-for="order in Orders">
            <a class="list-group-item list-group-item-action flex-column align-items-start">
                <div class="media d-flex w-100 justify-content-between">
                    <router-link :to="'/DetailProduct/'+order.procode" style="color: black" >
                        <img v-bind:src="order.img" class="align-self-start mr-3 widthSet heightSet" />
                    </router-link>
                    <div class="media-body">
                        <h5 class="mt-0"><router-link :to="'/DetailProduct/'+order.procode" style="color: black" >{{order.pro}}</router-link>
                        포함 {{order.kind}}종 {{order.qu}}개</h5>
                        <!--
                        <h6>주문자 : {{order.orderer}}</h6>
                        <h6 v-if="order.paid == 1">결제자 : {{order.buyer}}</h6>
                        -->
                    </div>
                    <strong class="text-black" style="color: #495057">총 결제금액 : {{order.price.toLocaleString()}}원
                        <br>
                        <router-link :to="'/DetailOrder/'+order.order_no" style="color: black"><small class="float-right">주문상세보기</small></router-link></strong>
                </div>
            </a>
            <a class="list-group-item list-group-item-action flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">
                        주문번호 :
                        <router-link :to="'/DetailOrder/'+order.order_no" style="color: black" >{{order.order_no}}</router-link>
                    </h6>
                    <strong style="color: crimson;" v-if="order.paid == 1">결제 완료</strong>
                    <strong style="color: black;" v-if="order.paid == 0">결제 대기</strong>
                </div>
            </a>
            <br>
        </div>
    </div>
</template>

<script>
    export default {
        name: "OrderView",
        props: {
            choice : ''
        },
        data () {
            return {
                user : {},
                Orders : [],
                temp : [],
                Products : [],
                kind : [ 0 ],
                allprice : 0,
                choiceType : null,
                allow : false,
                pcode : '',
                pquan : [],
                pnum : {
                    orderno : this.$route.params.order
                },
                seller : '',
                //lnk : 'http://localhost:3000/img/',
                lnk : "/img/"
            }
        },
        methods : {
        },
        watch : {
            choice : function (category) {
                if ( category == 'order') {
                    this.$store.dispatch('GetProfile')
                        .then( response => {
                            console.log('토큰검증 성공');
                            let UserNumber = {
                                number : response.data.user.number
                            };
                            this.user = response.data.user;

                            return this.$store.dispatch('GetOrder_3', this.user);
                        })
                        .then( response => {
                            console.log('get order : '+JSON.stringify(response.data));
                            var orders = response.data.order;
                            var sortingField = "order_no";
                            /*
                            orders.sort(function(a, b) { // 오름차순
                                return a[sortingField] - b[sortingField];
                            });
                             */
                            orders.sort(function(a, b) { // 내림차순
                                return b[sortingField] - a[sortingField];
                            });
                            this.temp = orders;

                            var p;
                            var p1;
                            var p2 = new Array;
                            var p3 = new Array;

                            for (var j=0; j<orders.length; j++){
                                p = response.data.order[j].product;
                                p1 = new Array;
                                p1 = p.split(',');
                                for (var i=0; i<p1.length; i++) {
                                    p2.push(p1[i].split('/'));
                                }
                                //console.log('p2 : '+JSON.stringify(p2));
                            }

                            for (var i=0; i<p2.length; i++){
                                p3.push(p2[i][0])
                            }
                            //console.log('p3 : '+JSON.stringify(p3));

                            var uniq = p3.reduce(function(a,b){
                                if (a.indexOf(b) < 0 ) a.push(b);
                                return a;
                            },[]);

                            //console.log(uniq, p3);

                            let findproducts = {
                                products : uniq
                            };

                            return this.$store.dispatch('GetProductDetail4', findproducts);
                        })
                        .then( response => {
                            console.log('response 2 : '+JSON.stringify(response.data.result));

                            var p;
                            var p1;
                            var p2;
                            var p3;

                            //console.log('temp length : '+this.temp.length);
                            for (var i=0; i<this.temp.length; i++){

                                p = this.temp[i].product;
                                p1 = new Array;
                                p2 = new Array;
                                p1 = p.split(',');
                                for (var j=0; j<p1.length; j++) {
                                    p2.push(p1[j].split('/'));
                                }
                                //console.log('1. p2 : '+JSON.stringify(p2));

                                for (var l=0; l<response.data.result.length; l++){
                                        //console.log('2. p2[0][0] : '+p2[0][0]);
                                        //console.log('2. response.data.result['+l+'].productcode : '+response.data.result[l].productcode);
                                        if (p2[0][0] == response.data.result[l].productcode) {
                                            var qu = 0;
                                            for (var m=0; m<p2.length; m++){
                                                p2[m][1] *= 1;
                                                qu += p2[m][1];
                                                //console.log('qu : '+qu);
                                            }
                                            this.temp[i].kind = p1.length;
                                            this.temp[i].qu = qu;
                                            this.temp[i].pro = response.data.result[l].productname;
                                            this.temp[i].procode = response.data.result[l].productcode;
                                            this.temp[i].img = this.lnk+response.data.result[l].thumbnail;
                                            //console.log('실행됨');
                                            break;
                                        }
                                }

                            }

                            //console.log('temp : '+JSON.stringify(this.temp));
                            this.Orders = this.temp;

                        })
                        .catch( err => {
                            //alert('잘못된 요청입니다.');
                            console.log('잘못된 요청입니다. : '+err);
                            //this.$router.replace({ path : '/' });
                        });
                }
                else {
                    console.log('주문내역 실패 : '+JSON.stringify(this.Products));
                }

            }
        }
    }
</script>

<style scoped>
    .widthSet {
        max-width: 80px;
    }
    .heightSet {
        max-height: 80px;
    }

    .jb-default-1 { font-size: 16px; }
    .jb-default-2 { font-size: 22px; }
    .jb-default-3 { font-size: 25px; }
    .jb-smaller { font-size: smaller; }
    .jb-larger { font-size: 40px; }
</style>