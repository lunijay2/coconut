<template>
    <div>
        <h2>{{user.name}}님의 주문서</h2><br><br>
        <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6">
                <h5 class="float-left">1. 주문상품 확인</h5>
                <table class="table">
                    <thead>
                    <tr class="table-active">
                        <th scope="col">상품정보</th>
                        <th scope="col">금액</th>
                        <th scope="col">수량</th>
                        <th scope="col">판매자</th>
                    </tr>
                    </thead>
                    <tbody v-for="Pro in Product">
                    <tr>
                        <td>{{Pro.productname}}</td>
                        <td>{{(Pro.quantity*Pro.price).toLocaleString()}}원</td>
                        <td>{{Pro.quantity}}개</td>
                        <td>{{Pro.seller}}</td>
                    </tr>
                    </tbody>
                </table>
                <br><br>
                <h5 class="float-left">2. 배송지 정보 입력</h5>
                <table class="table">
                    <thead>

                    <tr>
                        <th class="table-active" scope="row"><h6>고객입력 상세주소</h6></th>
                        <th scope="col">
                            <input type="text" v-model="addrDetail" id="addrDetail" class="form-control"  name="addrDetail" placeholder="상세 주소">
                        </th>
                    </tr>
                    <tr>
                        <th class="table-active" scope="row"><h6>우편번호</h6></th>
                        <th scope="col">
                            <input type="text" class="form-control"  v-model="zipNo" id="zipNo" name="zipNo" placeholder="우편번호">
                        </th>
                    </tr>
                    <tr>
                        <th class="table-active" scope="row"><h6>연락처</h6></th>
                        <th scope="col">
                            <input type="text" class="form-control" v-model="orderTel" placeholder="01012341234">
                        </th>
                    </tr>
                    </thead>
                </table>
                <br><br>
                <button @click="newOrderSubmit" type="button" class="btn btn-primary">주문하기</button>
            </div>
            <div class="col-md-3"></div>
        </div>
    </div>
    <!--
    <from>
        <div v-for="(Pro, i) in Product">
            <li>{{Pro.seller}}</li>
            <li>{{Pro.productcode}}</li>
            <li>{{Pro.name}}</li>
            <li>{{Pro.price}}</li>
            <li>{{Pro.category}}</li>
            <li>{{Products.product[i].quantity}}</li>
            <br>
        </div>
        <div>
            <li>{{Product}}</li>
        </div>
    </from>
    -->
</template>

<script>
    export default {
        name: "CreateOrder",
        data () {
            return {
                Product : {},
                Products : {},
                quantitys : {},
                aArray : [],
                bArray : [],
                roadFullAddr : '',
                roadAddrPart1 : '',
                roadAddrPart2 : '',
                addrDetail : '',
                zipNo : '',
                unum : Number,
                orderTel : '',
                number : 1,
                user : {},
                numbers : {},
            }
        },
        created() {
            this.$store.dispatch('GetProfile')
                .then( response => {
                    console.log('토큰검증 성공'+JSON.stringify(response.data.user));
                    this.unum = response.data.user.number;
                    this.user = response.data.user;

                    var a = this.$route.params.product;

                    console.log("이건뭐지"+JSON.stringify(this.$route.params.product));

                    var number = this.$route.params.number;
                    console.log("number : "+number);

                    if ( number == '1') {//바로구매
                        this.aArray = a.split('&');
                        this.Products = {
                            productcode : this.aArray[0],
                            quantity : this.aArray[1]
                        };
                        this.quantitys = this.aArray[1];

                        return this.$store.dispatch('GetProductDetail', this.Products);

                    } else if ( number == '0') {//장바구니
                        this.bArray = a.split(',');
                        console.log("안쪽에1"+JSON.stringify(this.bArray));
                        this.aArray = this.bArray.toString().split('&');
                        console.log("안쪽에2"+JSON.stringify(this.aArray));
                        this.bArray = this.aArray.toString().split(',');
                        console.log("안쪽에3"+JSON.stringify(this.bArray));
                        var cArray = [];

                        for (var i=0; i<(this.bArray.length); i++) {
                            if ( ((i+2) % 2) == 0) {
                                cArray.push(
                                    {
                                        productcode : this.bArray[i],
                                        quantity : this.bArray[i+1]
                                    }
                                );
                            }
                        }
                        this.Products = {
                            product : cArray,
                            name : this.user.name
                        };
                        console.log('product : '+JSON.stringify(this.Products));
                    }
                    return this.$store.dispatch('GetProductOder', this.Products);
                    this.numbers = this.$route.params.number;
                }, err => {
                    console.log('검증 실패' + err);
                    this.$store.dispatch('LOGOUT');
                    this.$router.replace({path : '/Login'});
                })
                .then( res => {
                    console.log('성공');
                    console.log('가지고 온 상품들 : '+JSON.stringify(res));
                    var a = res.data.result;
                    console.log('number'+ this.$route.params.number);
                    if ( this.$route.params.number == '1') {
                        a[0].quantity = this.quantitys

                    }else{
                        console.log('data : ' +JSON.stringify(JSON.stringify(res.data)));
                    }
                    this.Product = a;
                    console.log('data : ' +JSON.stringify(JSON.stringify(res.data)));
                    console.log('result : ' +JSON.stringify(JSON.stringify(res.data.result)));
                    console.log('Product : ' +JSON.stringify(JSON.stringify(this.Product)));
                })
                .catch( err => {
                    console.log('검증 실패' + err);
                    this.$store.dispatch('LOGOUT');
                    this.$router.replace({path : '/Login'});
                });
        },
        methods : {
            newOrderSubmit : function () {
                if ( this.addrDetail == '' || this.orderTel == '' ) {
                    alert('주소와 전화번호를 입력하세요');
                    console.log('validate fail');
                } else {
                    var allproduct = [];
                    for (var i=0; i<(this.Product.length); i++) {
                        allproduct.push(
                            {
                                product: this.Product[i].productcode + '/' + this.Product[i].quantity,
                                price: this.Product[i].price * this.Product[i].quantity,
                            }
                        );
                    }
                    console.log(JSON.stringify(" number :"+this.$route.params.number));
                    console.log(JSON.stringify(" length :"+this.Product.length));
                    console.log(JSON.stringify(" code :"+this.Product[0].productcode));
                    console.log(JSON.stringify(" price :"+this.Product[0].price));
                    console.log(JSON.stringify(" quantity :"+this.Product[0].quantity));
                    console.log(JSON.stringify(" allproduct :"+allproduct[0].product));
                    console.log(JSON.stringify(" quantity :"+this.quantitys));

                    let newOrder = {
                        product : allproduct,
                        orderer: this.unum,
                        delivery_address: this.addrDetail,
                        delivery_tel: this.orderTel
                    };
                    console.log("newOrder : "+JSON.stringify(newOrder));

                    this.$store.dispatch('newOrder', newOrder)
                        .then( response => {
                            if(response.data.success == true) {
                                //alert('Order Success');
                                console.log('Order Success : '+ JSON.stringify(response));
                                this.$router.push({ path : '/ChoicePayType/'+response.data.order.insertId});
                            } else {
                                alert('Order Failure');
                                console.log('Order Failure : '+ JSON.stringify(response))
                            }
                        }).catch( err => {
                        console.log('Order Err : '+ err);
                    });
                }
            }
        }
    }
</script>

<style scoped>

</style>