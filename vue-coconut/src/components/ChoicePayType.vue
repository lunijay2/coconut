<template>
    <div class="row" v-if="(allow == true) && (order.paid != 1)">
        <div class="col-md-2"></div>
        <div class="col-md-8">
            <h2>결제</h2>
            <hr noshade/>
            <table class="table">
                <thead>
                <tr class="table-active">
                    <th scope="col">상품정보</th>
                    <th scope="col">금액</th>
                    <th scope="col">수량</th>
                    <th scope="col">판매자</th>
                </tr>
                </thead>
                <tbody v-for="Pro in Products">
                <tr>
                    <td>
                        <div class="media">
                            <img v-bind:src="Pro.thumbnail" class="align-self-start mr-3 widthSet heightSet" />
                            <div class="media-body">
                                <h5 class="mt-0">{{Pro.productname}}</h5>
                                <h6 class="text-muted">
                                    {{Pro.description}}<br>
                                    {{Pro.category}}
                                </h6>
                            </div>
                        </div>
                    </td>
                    <td><h5>{{(Pro.oquantity*Pro.price).toLocaleString()}}원</h5></td>
                    <td><h5>{{Pro.oquantity}}개</h5></td>
                    <td><h5>{{Pro.seller}}</h5></td>
                </tr>
                </tbody>
            </table>
            <hr noshade/>
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <h6 class="col-md-3"></h6>
                        <h6 class="col-md-3">총 주문 상품수</h6>
                        <h6 class="col-md-3">{{kind[0]}}종 {{kind[1]}}개</h6>
                        <h6 class="col-md-3"></h6>
                    </div>
                    <hr class="my-4">
                    <div class="row">
                        <h6 class="col-md-3"></h6>
                        <h6 class="col-md-3">총 결제 예상 금액</h6>
                        <h5 style="color: crimson" class="col-md-4">{{allprice.toLocaleString()}}원</h5>
                        <h6 class="col-md-2"></h6>
                    </div>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-md-6">
                    <button @click="nomalChoice" type="button" class="btn btn-lg btn-primary col-md-12">바로 결제</button>
                    <div v-if="choiceType==true">
                        <hr noshade/>
                        <div class="alert alert-warning" role="alert">
                            <h3 class="page-header">인증서 비밀번호 입력</h3>
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" class="form-control" v-model="Cpass" name="password">
                            </div>
                            <button @click="Trade" type="button" class="btn btn-primary align-self-center">결제</button>
                        </div>
                    </div>
                </div>
                <br>
                <div class="col-md-6">
                    <button @click="qrChoice" type="button" class="btn btn-lg btn-success col-md-12">QR코드 결제</button>
                    <div v-if="choiceType==false">
                        <hr noshade/>
                        <div class="alert alert-warning" role="alert">
                            <qrcode-vue :value="value" :size="size" level="H"></qrcode-vue>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import QrcodeVue from 'qrcode.vue';
    export default {
        name: "ChoicePayType",
        data () {
            return {
                value : '',
                time : null,
                Cpass : '',
                size : 300,
                kind : [ 0 ],
                allprice : 0,
                choiceType : null,
                allow : false,
                user : {},
                order : {},
                pcode : '',
                pquan : [],
                seller : '',
                purchase : null,
                purchase1 : null,
                pnum : {
                    orderno : this.$route.params.order
                },
                Products : [],
                //lnk : 'http://localhost:3000/img/',
                lnk : "/img/"
            }
        },
        methods : {
            Trade : function () {
                let certR = {
                    pa : this.Cpass,
                    id : this.user.id,
                    unum : this.user.number,
                    order : this.order,
                    order_no : this.$route.params.order
                };
                this.$store.dispatch('TradeRequest', certR)
                    .then( (response) => {
                        //console.log('결제 : '+JSON.stringify(response));
                            alert('결제 완료');
                            //console.log('TradeRequest Success : '+JSON.stringify(response));
                            var p = response.data.order;
                            var p1 = p.split('/');
                            this.$router.replace({ path : '/PurchaseSuccess/'+p1[0] });
                    }).catch( err => {
                        //console.log('TradeRequest Err : '+ err);
                    });
            },
            quantityAppend : function(Prod) {
                for (let i=0; i<Prod.length; i++) {
                    for(let j=0; j<Prod.length; j++) {
                        //console.log('prod '+i+' : '+Prod[i].productcode);
                        //console.log('pquan '+j+' : '+ this.pquan[j][0]);
                        if(Prod[i].productcode == this.pquan[j][0]) {
                            Prod[i].oquantity = this.pquan[j][1];
                            console.log('일치');
                        }
                    }
                }
                this.Products = Prod;
            },
            imglnk : function () {
                for (var i=0; i<(this.Products.length); i++) {
                    this.Products[i].thumbnail = this.lnk+this.Products[i].thumbnail;
                }
            },
            nomalChoice : function () {
                this.choiceType = true;

            },
            qrChoice : function () {
                /*
                var v = {
                    no : this.order.order_no,
                    t : new Date().getTime()
                };
                */
                //this.value = JSON.stringify(v);
                //console.log('value : '+JSON.stringify(v));
                this.time = this.order.order_no+'/'+new Date().getTime();
                //console.log(this.time);
                this.value = this.time;
                this.choiceType = false;

                /*
                return this.$store.dispatch('GetOrder', this.pnum)
                    .then( (response) => {
                        console.log('결제 : '+JSON.stringify(response));
                    });

                 */

            },
            ainterval : function() {
                this.purchase1 = setInterval(() => {
                    this.$store.dispatch('SecondGetOrder', this.pnum)
                        .then( response => {
                            this.purchase = response.data.order[0].paid;
                            //console.log('this.purchase : '+JSON.stringify(this.purchase));

                            return this.paid_check(this.purchase);
                        })
                }, 2000);
            },
            paid_check : function(paid_request) {
                if (paid_request == 1) {
                    //console.log('paid 1');
                    clearInterval(this.purchase1);
                    this.$router.replace({ path : '/PurchaseSuccess/'+this.pnum.orderno });
                } else {
                    //console.log('paid 0');
                }
            }
        },
        created() {
            this.$store.dispatch('GetProfile')
                .then( response => {
                    //console.log('토큰검증 성공');
                    this.user = response.data.user;
                    return this.$store.dispatch('GetOrder', this.pnum);
                })
                .then( response => {
                    //console.log('get order : '+JSON.stringify(response.data));
                    this.order = response.data.order[0];
                    var p = response.data.order[0].product;

                    var p1 = p.split(',');
                    var p2 = new Array;
                    var p3 = new Array;
                    for (var i=0; i<p1.length; i++) {
                        p2.push(p1[i].split('/'));
                        p3.push(p2[i][1]);
                    }
                    //console.log('p2 : '+JSON.stringify(p2));
                    //console.log('p3 : '+JSON.stringify(p3));

                    this.pquan = p2;

                    var pcode2 = {
                        productcode : p
                    };
                    //console.log("pcode2 : "+JSON.stringify(pcode2));
                    return this.$store.dispatch('GetProductDetail2', pcode2);
                })
                .then( response => {
                    //console.log('product detail : '+JSON.stringify(response.data));
                    let pp = response.data.result;
                    for (let i=0; i<pp.length; i++) {
                        for(let j=0; j<pp.length; j++) {
                            this.pquan[i][j] *= 1;
                            //console.log('pp '+i+' : '+pp[i].productcode);
                            //console.log('pquan '+j+' : '+ this.pquan[j][0]);
                            if(pp[i].productcode == this.pquan[j][0]) {
                                pp[i].oquantity = this.pquan[j][1];
                                //console.log('일치');
                            } else {
                                //console.log('불일치');
                            }
                        }
                    }
                    this.Products = pp;
                    this.seller = response.data.result[0].seller;
                    this.imglnk();
                    //this.quantityAppend(response.data.result);
                    //console.log('product detail2 : '+JSON.stringify(this.Products));
                    if (this.user.number == this.order.orderer) {
                        this.allow = true;
                    } else {
                        alert('잘못된 요청입니다.');
                        this.$router.replace({ path : '/' });
                    }
                })
                .finally( () => {
                    this.kind[0] = this.Products.length;
                    this.kind[1] = 0;
                    for (let i=0; i<this.Products.length; i++){
                        this.allprice = this.allprice + this.Products[i].oquantity * this.Products[i].price;
                        this.Products[i].oquantity *= 1; //스트링을 정수로 형변환
                        this.kind[1] = this.kind[1] + this.Products[i].oquantity;
                    }

                    if ( this.order.paid == 0 ) {
                        this.ainterval();
                    } else {
                        alert('잘못된 요청입니다.');
                        this.$router.replace({ path : '/' });
                    }
                })
                .catch( err => {
                    alert('잘못된 요청입니다.');
                    this.$router.replace({ path : '/' });
                });
        },
        computed : {
        },
        watch : {
        },
        components: {
            QrcodeVue
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
    /*
	Max width before this PARTICULAR table gets nasty. This query will take effect for any screen smaller than 760px and also iPads specifically.
	*/
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
    }
</style>