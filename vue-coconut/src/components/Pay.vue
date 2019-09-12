<template>
    <div>
        <form @submit="PaySubmit">
            <p class="error">{{ error }}</p>
            <!--<p class="decode-result">Last result: <b>{{ result }}</b></p>-->
            <qrcode-stream v-if="!result.order_no" @decode="onDecode" @init="onInit" /><br><br>

            <div v-if="allow == true">
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

                <a class="list-group-item list-group-item-action flex-column align-items-start">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">주문 내역 확인</h5>
                        <small class="text-muted">주문번호 : {{result.order_no}}</small>
                    </div>
                    <p class="mb-1">{{result.product}}</p>
                    <small class="text-muted">{{result.price}}원</small>
                </a>
                <button @click="onResetSubmit" type="submit" class="btn btn-primary btn-lg">QR코드 재인식</button>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "Pay",
        data() {
            return {
                allow : false,
                Products : [],
                kind : [ 0 ],
                allprice : 0,
                user : {},
                order : {},
                pcode : '',
                pquan : [],
                seller : '',
                result : {},
                ordernumber : '',
                error : '',
                //lnk : 'http://localhost:3000/img/',
                lnk : "/img/"
            }
        },
        methods: {
            imglnk : function () {
                for (var i=0; i<(this.Products.length); i++) {
                    this.Products[i].thumbnail = this.lnk+this.Products[i].thumbnail;
                }
            },
            onResetSubmit : function() {
                this.allow = false;
            },
            onDecode (ordernumber) {
                this.ordernumber = ordernumber
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
            }
        },
        watch : {
            ordernumber : function (order) {
                let ordernum = {
                    orderno : order
                };
                this.$store.dispatch('GetOrder_2', ordernum)
                    .then( response => {
                        //alert('주문내역 성공 : '+JSON.stringify(response.data.order[0]));
                        this.result = response.data.order[0];
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
                        //여기까진 모바일에서 실행됨
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
                        this.allow = true; //모바일에서 여기까지 못옴
                        alert('product detail : '+JSON.stringify(response.data));
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
</style>