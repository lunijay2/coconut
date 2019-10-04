<template>
    <div class="list-group" v-if="choice == 'sales'">
        <h2>판매내역</h2>
        <br>
        <div v-for="order in Orders">
            <a class="list-group-item list-group-item-action flex-column align-items-start" v-for="ppp in order.pp">
                <div class="media d-flex w-100 justify-content-between">
                    <router-link :to="'/DetailProduct/'+order.procode" style="color: black" >
                        <img v-bind:src="ppp.pthumbnail" class="align-self-start mr-3 widthSet heightSet" />
                    </router-link>
                    <div class="media-body">
                        <h5 class="mt-0"><router-link :to="'/DetailProduct/'+ppp.pcode" style="color: black" >{{ppp.pname}}</router-link>
                             {{ppp.pquantity}}개</h5>
                        <h6 class="text-muted">{{ppp.pdescription}}</h6>
                        <h6 class="text-muted">{{ppp.pcategory}}</h6>
                        <!--
                        <h6>주문자 : {{order.orderer}}</h6>
                        <h6 v-if="order.paid == 1">결제자 : {{order.buyer}}</h6>
                        -->
                    </div>
                    <strong class="text-black" style="color: #495057">상품 금액 : {{(ppp.pquantity * ppp.pprice).toLocaleString()}}원
                        <br>
                        <router-link :to="'/DetailOrderSell/'+order.order_no" style="color: black"><small class="float-right">주문상세보기</small></router-link></strong>
                </div>
            </a>
            <a class="list-group-item list-group-item-action flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">
                        주문번호 :
                        <router-link :to="'/DetailOrderSell/'+order.order_no" style="color: black" >{{order.order_no}}</router-link>
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
        name: "SalesHistory",
        props: {
            choice : ''
        },
        data () {
            return {
                user : {},
                Orders : [],
                temp : [],
                temp2 : [],
                Products : [],
                kind : [ 0 ],
                allprice : 0,
                choiceType : null,
                allow : false,
                pcode : '',
                pquan : [],
                seller : '',
                //lnk : 'http://localhost:3000/img/',
                lnk : "/img/"
            }
        },
        methods : {
        },
        watch : {
            choice : function (category) {
                if ( category == 'sales') {
                    this.$store.dispatch('GetProfile')
                        .then( response => {
                            console.log('토큰검증 성공');
                            let UserNumber = {
                                number : response.data.user.number
                            };
                            this.user = response.data.user;

                            return this.$store.dispatch('MyGetProduct2', UserNumber);
                        })
                        .then( response => {
                            //console.log('response 1 : '+JSON.stringify(response));

                            let aaa = {
                                products : []
                            };

                            for (let i = 0; i < response.data.Product.length; i++) {
                                aaa.products.push(response.data.Product[i].productcode);
                            }

                            //console.log('aaa.products : '+aaa.products);

                            this.temp2 = response.data.Product;

                            /*
                            var orders = response.data.order;
                            var sortingField = "order_no";
                            orders.sort(function(a, b) { // 내림차순
                                return b[sortingField] - a[sortingField];
                            });
                            this.temp = orders;

                            let seller_number = {
                                seller : this.user.id,
                                number : this.user.number
                            };
                            */

                            return this.$store.dispatch('GetOrder_4', aaa);
                        })
                        .then( response => {
                            //console.log('response 2 : '+JSON.stringify(response));
                            //let myProduct = response.data.Product;

                            //console.log("all : "+JSON.stringify(response.data.order));
                            //console.log("[0] : "+JSON.stringify(response.data.order[0]));
                            //console.log("[1] : "+JSON.stringify(response.data.order[1]));

                            //console.log("[0][0] : "+JSON.stringify(response.data.order[0][0]));
                            //console.log("[1][0] : "+JSON.stringify(response.data.order[1][0]));

                            let arr = new Array;

                            for (let j=0; j<response.data.order.length; j++){
                                for (let k=0; k<response.data.order[j].length; k++){
                                    arr.push(response.data.order[j][k]);
                                }
                            }

                            //console.log('arr : '+JSON.stringify(arr));

                            var sortingField = "order_no";

                            /*
                            orders.sort(function(a, b) { // 오름차순
                                return a[sortingField] - b[sortingField];
                            });
                            */

                            arr.sort(function(a, b) { // 내림차순
                                return b[sortingField] - a[sortingField];
                            });

                            let uniq = arr.reduce(function(a, b){ //중복제거
                                //console.log("a : "+JSON.stringify(a));
                                //console.log("b : "+JSON.stringify(b));
                                if (JSON.stringify(a).indexOf(JSON.stringify(b)) < 0 ) {
                                    //console.log("들어옴1");
                                    a.push(b);
                                }
                                return a;
                            },[]);

                            /*
                            let uniq = arr.slice() // 정렬하기 전에 복사본을 만든다.
                                .sort(function(a, b){
                                    return b[sortingField] - a[sortingField];
                                })
                                .reduce(function(a, b){
                                    if (a.slice(-1)[0] !== b) a.push(b); // slice(-1)[0] 을 통해 마지막 아이템을 가져온다.
                                    return a;
                                },[]); //a가 시작될 때를 위한 비어있는 배열
                            */

                            /*
                            for (var i=0; i<this.temp.length; i++){
                                //여기서 temp의 주문정보들이랑 내상품들을 비교해서 temp에 상품정보를 추가하고 보이도록 하기
                            }
                             */

                            //console.log('uniq : '+JSON.stringify(uniq));
                            this.temp = uniq;

                            var p;
                            var p1;
                            var p2;
                            var p3;

                            //console.log('temp length : '+this.temp.length);
                            for (let z=0; z<this.temp.length; z++) {
                                this.temp[z].pp = [];
                                p = this.temp[z].product;
                                p1 = new Array;
                                p2 = new Array;
                                p1 = p.split(',');
                                //console.log('p : ' + p);
                                //console.log('p1 : ' + p1.length);
                                for (let x = 0; x < p1.length; x++) {
                                    p2.push(p1[x].split('/'));
                                }
                                //console.log('1. p2 : ' + JSON.stringify(p2));

                                for (let f=0; f<p2.length; f++) {
                                    //console.log("f 반복문 f : "+f);
                                    for (let q=0; q<this.temp2.length; q++){
                                        //console.log('2. p2['+f+'][0] : ' + p2[f][0]);
                                        //console.log('2. this.temp2[' + q + '].productcode : ' + this.temp2[q].productcode);
                                        if (p2[f][0] == this.temp2[q].productcode) {
                                            //console.log("들어옴2");
                                            let proArr = {
                                                pcode : this.temp2[q].productcode,
                                                pprice : this.temp2[q].price,
                                                pname : this.temp2[q].productname,
                                                pdescription : this.temp2[q].description,
                                                pcategory : this.temp2[q].category,
                                                pname : this.temp2[q].productname,
                                                pthumbnail : this.lnk + this.temp2[q].thumbnail,
                                                pquantity : p2[f][1]
                                            };
                                            //console.log("proArr : "+JSON.stringify(proArr));
                                            this.temp[z].pp.push(proArr);
                                            //console.log("this.temp : "+JSON.stringify(this.temp));
                                            break;
                                        } else {
                                            //console.log("못들어옴2");
                                        }
                                    }
                                }
                            }

                                /*
                                console.log('temp length : '+this.temp.length);
                                for (var z=0; z<this.temp.length; z++){

                                    p = this.temp[z].product;
                                    p1 = new Array;
                                    p2 = new Array;
                                    p1 = p.split(',');
                                    console.log('p : '+p);
                                    console.log('p1 : '+p1.length);
                                    for (var x=0; x<p1.length; x++) {
                                        p2.push(p1[x].split('/'));
                                    }
                                    console.log('1. p2 : '+JSON.stringify(p2));

                                    for (var f=0; f<this.temp2.length; f++){
                                        console.log('2. p2[0][0] : '+p2[0][0]);
                                        console.log('2. this.temp2['+f+'].productcode : '+this.temp2[f].productcode);
                                        if (p2[0][0] == this.temp2[f].productcode) {
                                            var qu = 0;
                                            for (var m=0; m<p2.length; m++){
                                                p2[m][1] *= 1;
                                                qu += p2[m][1];
                                                //console.log('qu : '+qu);
                                            }
                                            this.temp[z].kind = p1.length;
                                            this.temp[z].qu = qu;
                                            this.temp[z].pro = this.temp2[f].productname;
                                            this.temp[z].procode = this.temp2[f].productcode;
                                            this.temp[z].img = this.lnk+this.temp2[f].thumbnail;
                                            console.log('실행됨');
                                            break;
                                        }
                                    }

                                }
                                 */

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
                    console.log('판매내역 실패 : '+JSON.stringify(this.Products));
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