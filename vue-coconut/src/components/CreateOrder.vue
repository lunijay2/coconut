<template>
    <div v-if="Product.name">
        <h2>주문서</h2><br><br>
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
                    <tbody>
                    <tr>
                        <td>{{Product.name}}</td>
                        <td>{{(Product.price*quantity).toLocaleString()}}</td>
                        <td>{{quantity}}</td>
                        <td>{{Product.seller}}</td>
                    </tr>
                    </tbody>
                </table>
                <br><br>
                <h5 class="float-left">2. 배송지 정보 입력</h5>
                <table class="table">
                    <thead>
                        <!--
                        <th scope="col">
                            <form name="form" id="form" method="post">
                                <input type="text" name="currentPage" value="1"/> <-- 요청 변수 설정 (현재 페이지. currentPage : n > 0)
                                <input type="text" name="countPerPage" value="10"/> 요청 변수 설정 (페이지당 출력 개수. countPerPage 범위 : 0 < n <= 100)
                                <input type="text" name="resultType" value="json"/> <-- 요청 변수 설정 (검색결과형식 설정, json)
                                <input type="text" name="confmKey" value="U01TX0FVVEgyMDE5MDcxMDE2MzIwMTEwODg3MTk="/> 요청 변수 설정 (승인키)
                                <input type="text" name="keyword" value="" onkeydown="enterSearch();"/> 요청 변수 설정 (키워드)
                                <input type="button" onClick="getAddr();" value="주소검색하기"/>
                                <div id="list" ></div>검색 결과 리스트 출력 영역
                            </form>
                        </th>
                        -->
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
</template>

<script>
    export default {
        name: "CreateOrder",
        data () {
            return {
                Product : {},
                quantity : this.$route.params.quantity,
                roadFullAddr : '',
                roadAddrPart1 : '',
                roadAddrPart2 : '',
                addrDetail : '',
                zipNo : '',
                unum : Number,
                orderTel : ''
            }
        },
        created() {
            this.$store.dispatch('GetProfile')
                .then( response => {
                    console.log('토큰검증 성공'+JSON.stringify(response.data.user));
                    this.unum = response.data.user.number;
                    let product = {
                        productcode : this.$route.params.product,
                        quantity : this.$route.params.quantity
                    };
                    return this.$store.dispatch('GetProductDetail', product);
                }, err => {
                    console.log('검증 실패' + err);
                    this.$store.dispatch('LOGOUT');
                    this.$router.replace({path : '/Login'});
                })
                .then( res => {
                    console.log('성공');
                    console.log('response : '+JSON.stringify(res));
                    this.Product = res.data.result;
                })
                .catch( err => {
                    console.log('검증 실패' + err);
                    this.$store.dispatch('LOGOUT');
                    this.$router.replace({path : '/Login'});
                });
        },
        methods : {
            goPopup : function () {
                var pop = window.open("jusoPopup.jsp","pop","width=570,height=420, scrollbars=yes, resizable=yes");
            },
            newOrderSubmit : function () {
                if ( this.addrDetail == '' || this.orderTel == '' ) {
                    alert('주소와 전화번호를 입력하세요');
                    console.log('validate fail');
                } else {
                    let newOrder = {
                        product: this.Product.productcode + '/' + this.quantity,
                        price: this.Product.price * this.quantity,
                        orderer: this.unum,
                        delivery_address: this.addrDetail,
                        delivery_tel: this.orderTel
                    };
                    console.log(JSON.stringify(newOrder));

                    this.$store.dispatch('newOrder', newOrder)
                        .then( response => {
                            if(response.data.success == true) {
                                alert('Order Success');
                                console.log('Order Success');
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