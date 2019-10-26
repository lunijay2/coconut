<template>
    <div class="row">
        <div class="col-md-2"></div>
        <div class="col-md-8">
            <h2>주문번호 : {{ordernumber.orderno}}</h2>
            <hr noshade/>
            <table class="table">
                <thead>
                <tr class="table-active">
                    <th scope="col">판매 상품정보</th>
                    <th scope="col">금액</th>
                    <th scope="col">수량</th>
                    <th scope="col">판매자</th>
                    <th scope="col">영수증</th>
                </tr>
                </thead>
                <tbody v-for="Pro in Products">
                <tr v-if="Pro.seller == Store.company">
                    <td>
                        <div class="media">
                            <img :src="Pro.imageBlob" class="align-self-start mr-3 widthSet heightSet" />
                            <!--<img v-bind:src="Pro.thumbnail" class="align-self-start mr-3 widthSet heightSet" />-->
                            <div class="media-body">
                                <h5 class="mt-0">{{Pro.productname}}</h5>
                                <h6 class="text-muted">
                                    {{Pro.description}}<br>
                                    {{Pro.category}}
                                </h6>
                            </div>
                        </div>
                    </td>
                    <td><h5>{{(Pro.quantity*Pro.price).toLocaleString()}}원</h5></td>
                    <td><h5>{{Pro.quantity}}개</h5></td>
                    <td><h5>{{Pro.seller}}</h5></td>
                    <td>
                        <h5 v-if="receipt == false">미발급</h5>
                        <h5 v-if="receipt == true" >발급 완료</h5>
                    </td>
                </tr>
                </tbody>
            </table>
            <hr noshade/>
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <h6 class="col-md-1"></h6>
                        <h6 class="col-md-2"><strong>주문자</strong></h6>
                        <h6 class="col-md-3">{{order.orderer}}</h6>
                        <h6 class="col-md-1"></h6>
                        <h6 class="col-md-2"><strong>구매자</strong></h6>
                        <h6 class="col-md-3">{{order.buyer}}</h6>
                    </div>
                    <hr class="my-4">
                    <div class="row">
                        <h6 class="col-md-1"></h6>
                        <h6 class="col-md-2"><strong>배송 주소</strong></h6>
                        <h6 class="col-md-3">{{order.delivery_address}}</h6>
                        <h6 class="col-md-1"></h6>
                        <h6 class="col-md-2"><strong>전화번호</strong></h6>
                        <h6 class="col-md-3">{{order.delivery_tel}}</h6>
                    </div>
                    <hr class="my-4">
                    <div class="row">
                        <h6 class="col-md-1"></h6>
                        <h6 class="col-md-2"><strong>결제 시간</strong></h6>
                        <h6 class="col-md-3"></h6>
                        <h6 class="col-md-1"></h6>
                        <h6 class="col-md-4">{{date.getFullYear()}}-{{("0"+(date.getMonth()+1)).slice(-2)}}-{{("0"+(date.getDate()+1)).slice(-2)}} / {{("0"+(date.getHours()+1)).slice(-2)}}:{{("0"+(date.getMinutes()+1)).slice(-2)}}:{{("0"+(date.getSeconds()+1)).slice(-2)}}</h6>
                        <h6 class="col-md-1"></h6>
                    </div>
                </div>
            </div>
            <br>
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <h6 class="col-md-3"></h6>
                        <h6 class="col-md-3"><strong>주문 상품수</strong></h6>
                        <h6 class="col-md-3">{{kind[0]}}종 {{kind[1]}}개</h6>
                        <h6 class="col-md-3"></h6>
                    </div>
                    <hr class="my-4">
                    <div class="row">
                        <h6 class="col-md-3"></h6>
                        <h6 class="col-md-3"><strong>결제 금액</strong></h6>
                        <h5 style="color: crimson" class="col-md-4">{{allprice.toLocaleString()}}원</h5>
                        <h6 class="col-md-2"></h6>
                    </div>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-md-12">
                    <div v-if="receipt == false">
                        <button @click="ReceiptissueButton" type="button" class="btn btn-lg btn-primary col-md-12">영수증 발급</button>
                        <div v-if="receiptissuing == true">
                            <br>
                            <div class="alert alert-warning" role="alert">
                                <h3 class="page-header">인증서 비밀번호 입력</h3>
                                <div class="form-group">
                                    <label>Password</label>
                                    <input type="password" class="form-control" v-model="Cpass" name="password">
                                </div>
                                <button @click="Receiptissue" type="button" class="btn btn-primary align-self-center">영수증 발급</button>
                            </div>
                        </div>
                    </div>
                    <div v-if="receipt == true">
                        <button @click="Receiptcheck" type="button" class="btn btn-lg btn-primary col-md-12">영수증 확인</button>
                        <div v-if="receiptchecking == true">
                            <hr noshade/>
                            <br>
                            <h3 class="align-center">영수증</h3>
                            <br>
                            <h5>상  호 :  {{Store.company}}</h5>
                            <h5>사업자 번호 :  {{Store.crn}}</h5>
                            <h5>주  소 :  {{user.addr}}</h5>
                            <h5>대표자 :  {{user.name}}</h5>
                            <h5>전화번호 : {{user.tel}}</h5>
                            <h5>매출일 : {{date.getFullYear()}}-{{("0"+(date.getMonth()+1)).slice(-2)}}-{{("0"+(date.getDate()+1)).slice(-2)}} / {{("0"+(date.getHours()+1)).slice(-2)}}:{{("0"+(date.getMinutes()+1)).slice(-2)}}:{{("0"+(date.getSeconds()+1)).slice(-2)}}</h5>
                            <h5>번  호 : {{order.order_no}}</h5>
                            <br>
                            <table class="table">
                                    <thead>
                                    <tr class="table-active">
                                        <th scope="col">상품명</th>
                                        <th scope="col">단가</th>
                                        <th scope="col">수량</th>
                                        <th scope="col">금액</th>
                                    </tr>
                                    </thead>
                                    <tbody v-for="Pro in Products">
                                    <tr>
                                        <td>
                                            <div class="media">
                                                <div class="media-body">
                                                    <h5 class="mt-0">{{Pro.productname}}</h5>
                                                </div>
                                            </div>
                                        </td>
                                        <td><h5>{{(Pro.price).toLocaleString()}}</h5></td>
                                        <td><h5>{{Pro.quantity}}</h5></td>
                                        <td><h5>{{(Pro.quantity*Pro.price).toLocaleString()}}</h5></td>
                                    </tr>
                                    </tbody>
                            </table>
                            <div class="card" v-for="reSign in receiptSign">
                                <div class="card-body">
                                    <div class="row">
                                        <h6 class="col-md-3"><strong>영수증 서명값</strong></h6>
                                        <h6 class="col-md-6">{{reSign}}</h6>
                                        <h6 class="col-md-3"><button @click="receiptcheckSubmit" type="button" class="btn btn-primary col-md-12">영수증 서명 확인</button></h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br><br><br>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DetailOrderSell",
        data () {
            return {
                user : {},
                temp : [],
                Products : [],
                Store : {},
                size : 300,
                kind : [ 0 ],
                allprice : 0,
                choiceType : null,
                allow : false,
                order : {},
                pcode : '',
                pquan : [],
                seller : '',
                receiptPro : [],
                receiptSign : [],
                receipt : false,
                receipttmp : null,
                receiptissuing : false,
                receiptchecking : false,
                Cpass : '',
                ordernumber : {
                    orderno : this.$route.params.order
                },
                date : '',
                //lnk : 'http://localhost:3000/img/',
                //lnk : "/img/"
            }
        },
        created() {
            this.$store.dispatch('GetProfile')
                .then(response => {
                    console.log('토큰검증 성공');
                    this.user = response.data.user;
                    console.log('user : '+JSON.stringify(this.user));

                    let UserNumber1 = {
                        number : this.user.number
                    };
                    return this.$store.dispatch('FoundEnt', UserNumber1);
                })
                .then(response => {
                    this.Store = response.data.store;
                    console.log('Store : '+JSON.stringify(this.Store));
                    return this.$store.dispatch('GetOrder', this.ordernumber);
                })
                .then(response => {
                    console.log('get order : ' + JSON.stringify(response.data));
                    this.order = response.data.order[0];
                    var p = response.data.order[0].product;

                    var p1 = p.split(',');
                    var p2 = new Array;
                    var p3 = new Array;
                    for (var i = 0; i < p1.length; i++) {
                        p2.push(p1[i].split('/'));
                        p3.push(p2[i][1]);
                    }
                    console.log('p2 : ' + JSON.stringify(p2));
                    console.log('p3 : ' + JSON.stringify(p3));

                    this.pquan = p2;

                    var re = response.data.order[0].receipt;
                    if ( re != null ) {
                        this.receipttmp = re;
                    } else {
                        this.receipt = null;
                    }

                    let UserNumber = {
                        number : this.user.number
                    };
                    console.log("UserNumber : "+JSON.stringify(UserNumber));

                    return this.$store.dispatch('MyGetProduct2', UserNumber);
                })
                .then(response => {
                    console.log('My product : ' + JSON.stringify(response.data));
                    let pp = response.data.Product;
                    console.log('pp : ' + JSON.stringify(pp)); //판매자의 상품들

                    console.log("pquan : "+JSON.stringify(this.pquan)); //주문정보의 상품코드+수량
                    //console.log("pquan[0] : "+JSON.stringify(this.pquan[0]));
                    //console.log("pquan[0][0] : "+JSON.stringify(this.pquan[0][0]));
                    //console.log("pquan[0][1] : "+JSON.stringify(this.pquan[0][1]));

                    if ( this.receipt != null ) {
                        var r = this.receipttmp;
                        var r1 = r.split('+');
                        var r2 = new Array;
                        var r3 = new Array;
                        for (var i = 0; i < r1.length; i++) {
                            r2.push(r1[i].split('-'));
                            r3.push(r2[i][0]);
                        }
                        console.log('r2 : ' + JSON.stringify(r2));
                        console.log('r3 : ' + JSON.stringify(r3));
                    }
                    let ppp = new Array;
                    for (var j=0; j<this.pquan.length; j++){
                        for (var k=0; k<pp.length; k++) {
                            if (this.pquan[j][0] == pp[k].productcode) {

                                var bytes = new Uint8Array(pp[k].image.data);
                                var blob = new Blob([bytes], {type:'image/png'});
                                //this.Products[i].imageBlob = URL.createObjectURL(blob);

                                ppp.push({
                                    productcode : pp[k].productcode,
                                    productname : pp[k].productname,
                                    description : pp[k].description,
                                    category : pp[k].category,
                                    price : pp[k].price,
                                    seller : pp[k].seller,
                                    //thumbnail : this.lnk + pp[k].thumbnail,
                                    imageBlob : URL.createObjectURL(blob),
                                    quantity : this.pquan[j][1] *= 1,
                                    receipt : null
                                })
                            }
                        }
                    }
                    console.log('ppp : '+JSON.stringify(ppp));
                    this.Products = ppp;

                    if (this.order.receipt != null) {
                        var receipt00;
                        var receipt01 = [];
                        var receipt02 = [];
                        var receipt03 = [];
                        let char01 = '';
                        receipt00 = this.order.receipt.split(',');
                        for (var q=0; q<receipt00.length; q++){
                            receipt01.push(receipt00[q].split('+'));
                        }
                        for (var l = 0; l < receipt01.length; l++) {
                            receipt02.push(receipt01[l][0].split('-'));
                            for (var m = 0; m < receipt02[l].length; m++) {
                                receipt03.push(receipt02[l][m].split('/'));
                                //receipt04.push(receipt03[j][0]);
                            }
                        }
                        let receiptCount = 0;
                        for (var n=0; n<receipt03.length; n++){
                            if (receiptCount > 0) {
                                this.receipt = true;
                                console.log('영수증 있음 3');
                                break;
                            } else {
                                for (var o=0; o<this.Products.length; o++){
                                    if (receipt03[n][0] == this.Products[o].productcode) {
                                        receiptCount += 1;
                                        this.receipt = true;
                                        console.log('영수증 있음 1');
                                        char01 = receipt03[n][0] + '/';
                                        var isExist;
                                        for (var u = 0; u < receipt01.length; u++){
                                            isExist = (receipt01[u][0].indexOf(char01)!== -1);
                                            console.log('isExist : '+isExist);
                                            console.log('u : '+u);
                                            if (isExist == true) {
                                                console.log('receipt01['+u+'][1] : '+receipt01[u][1]);
                                                this.receiptSign.push(receipt01[u][1]);
                                                break;
                                            }
                                        }
                                        break;
                                    } else {
                                        console.log('영수증 없음 1');
                                    }
                                }
                            }
                            if (n == (receipt03.length - 1)) {
                                if (receiptCount == 0) {
                                    this.receipt = false;
                                    console.log('영수증 없음 2');
                                } else {
                                    this.receipt = true;
                                    console.log('영수증 있음 2');
                                    break;
                                }
                            }
                        }
                    } else {
                        this.receipt = false;
                        console.log('영수증 없음 3');
                    }

                })
                .finally(() => {
                    this.kind[0] = this.Products.length;
                    this.kind[1] = 0;
                    for (let i = 0; i < this.Products.length; i++) {
                        this.allprice = this.allprice + this.Products[i].quantity * this.Products[i].price;
                        this.Products[i].quantity *= 1; //스트링을 정수로 형변환
                        this.kind[1] = this.kind[1] + this.Products[i].quantity;
                    }

                    this.date = new Date((this.order.trade_time *= 1));


                })
                .catch(err => {
                    alert('잘못된 요청입니다.');
                    console.log('err : '+err);
                    //this.$router.replace({path: '/'});
                });
        },
        methods : {
            ReceiptissueButton : function() {
                if (this.receiptissuing == true) {
                    this.receiptissuing = false;
                } else {
                    this.receiptissuing = true;
                }
                console.log("order : "+JSON.stringify(this.order));
            },
            Receiptissue : function() {

                let receiptR = {
                    pa : this.Cpass,
                    user : this.user,
                    order : this.order,
                    product : '',
                    pprice : 0,
                };

                for (var i = 0; i < this.Products.length; i++) { //product 문장 만들기
                    if (i == 0) {
                        receiptR.product = this.Products[i].productcode + '/' + this.Products[i].quantity;
                    } else {
                        receiptR.product = receiptR.product + '-' + this.Products[i].productcode + '/' + this.Products[i].quantity;
                    }
                    receiptR.pprice += (this.Products[i].quantity * this.Products[i].price);
                }

                console.log("receiptR : "+ JSON.stringify(receiptR));

                this.$store.dispatch('ReceiptRequest', receiptR)
                    .then( (response) => {
                        console.log('영수증 : '+JSON.stringify(response));
                        alert('발급 완료');
                        console.log('ReceiptRequest Success : '+JSON.stringify(response));
                        var p = response.data.order;
                        //var p1 = p.split('/');
                        //this.$router.push({ path : '/SalesHistory' });
                    }).catch( err => {
                        console.log('ReceiptRequest Err : '+ err);
                });

            },
            Receiptcheck : function() {
                if (this.receiptchecking == true) {
                    this.receiptchecking = false;
                } else {
                    this.receiptchecking = true;
                }
            },
            receiptcheckSubmit : function() {

                let orderReceiptnull = this.order;
                orderReceiptnull.receipt = null;

                let receiptR = {
                    user : this.user,
                    order : orderReceiptnull,
                    product : '',
                    pprice : 0,
                    signature : this.receiptSign
                };

                for (var i = 0; i < this.Products.length; i++) { //product 문장 만들기
                    if (i == 0) {
                        receiptR.product = this.Products[i].productcode + '/' + this.Products[i].quantity;
                    } else {
                        receiptR.product = receiptR.product + '-' + this.Products[i].productcode + '/' + this.Products[i].quantity;
                    }
                    receiptR.pprice += (this.Products[i].quantity * this.Products[i].price);
                }

                console.log("receiptR : "+ JSON.stringify(receiptR));

                this.$store.dispatch('ReceiptValidateRequest', receiptR)
                    .then( response => {
                        console.log('영수증 검증 : '+JSON.stringify(response));
                        alert('영수증 검증 성공');
                        console.log('ReceiptValidate Request Success : '+JSON.stringify(response));
                    }).catch( err => {
                    console.log('ReceiptValidate Request Err : '+ err);
                });
            },
            quantityAppend : function(Prod) {
                for (let i=0; i<Prod.length; i++) {
                    for(let j=0; j<Prod.length; j++) {
                        console.log('prod '+i+' : '+Prod[i].productcode);
                        console.log('pquan '+j+' : '+ this.pquan[j][0]);
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
        },
        watch : {
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
    .align-center {
        text-align: center;
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
            background: #ffffff;
        }

        td {
            /* Behave  like a "row" */
            border: black;
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
        td:nth-of-type(1):before { content: "판매 상품정보"; }
        td:nth-of-type(2):before { content: "금액"; }
        td:nth-of-type(3):before { content: "수량"; }
        td:nth-of-type(4):before { content: "판매자"; }
        td:nth-of-type(5):before { content: "영수증"; }
    }

</style>