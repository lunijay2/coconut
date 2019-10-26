<template>
    <div>
        <form @submit="PaySubmit">
            <p class="error">{{ error }}</p>
            <!--<p class="decode-result">Last result: <b>{{ result }}</b></p>-->
            <qrcode-stream v-if="!allow == true" @decode="onDecode" @init="onInit" />
            <div class="row" v-if="allow == true">
                <div class="col-md-2"></div>
                <div class="col-md-8">
                    <h2>주문 정보 확인</h2>
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
                                    <img :src="Pro.imageBlob" class="align-self-start mr-3 widthSet heightSet" />
                                    <!--
                                    <img v-bind:src="Pro.thumbnail" class="align-self-start mr-3 widthSet heightSet" />-->
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
                            <button @click="onResetSubmit" type="button" class="btn btn-lg btn-success col-md-12">QR코드 재인식</button>
                        </div>
                        <br>
                        <div class="col-md-6">
                            <button @click="nomalChoice" type="button" class="btn btn-lg btn-primary col-md-12">결제</button>
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
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "Pay",
        data() {
            return {
                choiceType : null,
                allow : false,
                Products : [],
                kind : [ 0 ],
                allprice : 0,
                Cpass : '',
                user : {},
                order : {},
                pcode : '',
                pquan : [],
                pnum : {},
                seller : '',
                result : {},
                ordernumber : '',
                error : '',
                //lnk : 'http://localhost:3000/img/',
                //lnk : "/img/"
            }
        },
        methods: {
            Trade : function () {

                let certcheckR = {
                    id : this.user.id,
                };

                this.$store.commit("GET_CERTTYPE", this.user);
                //console.log('CertType : '+this.$store.state.CertType);

                this.$store.dispatch('CertCheck', certcheckR)
                    .then( response => {
                        console.log('CertCheck response : '+JSON.stringify(response));
                        if ((response.data.success == true) && (response.data.result[0].allowed == 1) && (response.data.result[0].disable == 0)) {
                            var ornum = (this.ordernumber).split("/");
                            let certR = {
                                pa: this.Cpass,
                                id: this.user.id,
                                unum: this.user.number,
                                order: this.order,
                                order_no: ornum[0]
                            };
                            return this.$store.dispatch('TradeRequest', certR);
                        } else {
                            //console.log('CertCheck err : '+JSON.stringify(response));
                            alert('유효하지 않은 인증서입니다.');
                        }
                    })
                    .then( (response) => {
                        if (response.data.success == true) {
                            alert('결제 완료');
                            //console.log('TradeRequest Success : '+JSON.stringify(response));
                            var p = response.data.order;
                            var p1 = p.split('/');
                            this.$router.replace({path: '/PurchaseSuccess/' + p1[0]});
                        }
                    }).catch( err => {
                        console.log('TradeRequest Err : '+ err);
                        alert('결제 실패 : '+err);
                    });
            },
            nomalChoice : function () {
                this.choiceType = true;
            },
            imglnk : function () {
                for (var i=0; i<(this.Products.length); i++) {
                    //this.Products[i].thumbnail = this.lnk+this.Products[i].thumbnail;
                    var bytes = new Uint8Array(this.Products[i].image.data);
                    var blob = new Blob([bytes], {type:'image/png'});
                    this.Products[i].imageBlob = URL.createObjectURL(blob);
                }
            },
            onResetSubmit : function() {
                this.allow = false;
                this.choiceType = null;
            },
            onDecode (ordernumber) {
                this.ordernumber = ordernumber;
            },
            async onInit (promise) {
                try {
                    await promise
                } catch (error) {
                    if (error.name === 'NotAllowedError') {
                        this.error = "ERROR: 카메라 허용을 해주십시오. "
                    } else if (error.name === 'NotFoundError') {
                        this.error = "ERROR: 카메라가 없습니다. "
                    } else if (error.name === 'NotSupportedError') {
                        this.error = "ERROR: 보안 프로토콜 미사용 (HTTPS, localhost)"
                    } else if (error.name === 'NotReadableError') {
                        this.error = "ERROR: 카메라 이미 사용중"
                    } else if (error.name === 'OverconstrainedError') {
                        this.error = "ERROR: 유효하지 않은 카메라"
                    } else if (error.name === 'StreamApiNotSupportedError') {
                        this.error = "ERROR: 브라우저에서 지원하지 않는 스트림 API"
                    }
                }
            },
            PaySubmit() {
                let number = '';
                let t = '';
                let exit = false;
                let i = 0;//문자열에 한글자씩 접근하는 인덱스
                let j = 0;//0이면 주문번호, 1이면 jwt
                while(exit) {
                    if(this.ordernumber.charAt(i)) {
                        if(j==0) {
                            number = number + this.ordernumber.charAt(i);
                        }
                        else {
                            t = t + this.ordernumber.charAt(i);
                        }
                    }
                }
                const Payinfo = {
                    order_no : number,
                    t : t
                };
                alert('payinfo : '+JSON.stringify(Payinfo));
                this.$store.dispatch('PAY', Payinfo)
                    .then(response => {
                        console.log(response);
                    })
            },
        },
        watch : {
            ordernumber : function (order) {
                let ordernum = {
                    orderno : order
                };
                this.$store.dispatch('GetProfile')
                    .then( response => {
                        console.log('토큰검증 성공');
                        this.user = response.data.user;
                        return this.$store.dispatch('GetOrder_2', ordernum)
                    })
                    .then( response => {
                        //alert('주문내역 성공 : '+JSON.stringify(response.data.order[0]));
                        this.order = response.data.order[0];
                        this.pnum.orderno = this.order.orderno;
                        //alert('주문내역 : '+JSON.stringify(response.data.order[0]));

                        var p = response.data.order[0].product;
                        var p1 = p.split(',');
                        var p2 = new Array;
                        var p3 = new Array;
                        for (var i=0; i<p1.length; i++) {
                            p2.push(p1[i].split('/'));
                            p3.push(p2[i][1]);
                        }
                        console.log('p2 : '+JSON.stringify(p2));
                        console.log('p3 : '+JSON.stringify(p3));
                        this.pquan = p2;
                        let pcode = {
                            productcode : response.data.order[0].product
                        };
                        return this.$store.dispatch('GetProductDetail2', pcode);
                    })
                    .then( response => {
                        console.log('product detail : '+JSON.stringify(response.data));
                        let pp = response.data.result;
                        for (let i=0; i<pp.length; i++) {
                            for(let j=0; j<pp.length; j++) {
                                this.pquan[i][j] *= 1;
                                console.log('pp '+i+' : '+pp[i].productcode);
                                console.log('pquan '+j+' : '+ this.pquan[j][0]);
                                if(pp[i].productcode == this.pquan[j][0]) {
                                    pp[i].oquantity = this.pquan[j][1];
                                    console.log('일치');
                                } else {
                                    console.log('불일치');
                                }
                            }
                        }
                        this.Products = pp;
                        this.seller = response.data.result[0].seller;
                        this.imglnk();
                        //this.quantityAppend(response.data.result);
                        this.allow = true;
                        //alert('product detail : '+JSON.stringify(response.data));
                        console.log('product detail2 : '+JSON.stringify(this.Products));
                    })
                    .finally( () => {
                        this.kind[0] = this.Products.length;
                        this.kind[1] = 0;
                        for (let i=0; i<this.Products.length; i++){
                            this.allprice = this.allprice + this.Products[i].oquantity * this.Products[i].price;
                            this.Products[i].oquantity *= 1; //스트링을 정수로 형변환
                            this.kind[1] = this.kind[1] + this.Products[i].oquantity;
                        }
                    })
                    .catch( err => {
                        console.log('주문내역 실패 : ' + err);
                        //alert(err);
                    })
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
        td:nth-of-type(1):before { content: "상품정보"; }
        td:nth-of-type(2):before { content: "금액"; }
        td:nth-of-type(3):before { content: "수량"; }
        td:nth-of-type(4):before { content: "판매자"; }
    }
</style>