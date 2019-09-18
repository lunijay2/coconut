<template>
    <div class="row" v-if="(order.paid == 1) && (user.number == order.buyer)">
        <div class="col-md-2"></div>
        <div class="col-md-8">
            <h2>결제 완료</h2>
            <hr noshade/>
            <table class="table">
                <thead>
                <tr class="table-active">
                    <th style="width: 350px;">결제 금액</th>
                    <th>결제일</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><h5>{{order.price.toLocaleString()}}원</h5></td>
                    <td>
                        <h5>{{date.getFullYear()}}-{{date.getMonth()}}-{{date.getDate()}} {{date.getHours()}}:{{date.getMinutes()}}:{{date.getSeconds()}}</h5>
                    </td>
                </tr>
                </tbody>
            </table>
            <hr noshade/>
            <table class="table">
                <thead>
                <tr class="table-active">
                    <th>구매자</th>
                    <th>주문자</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td style="width: 350px;">{{user.name}}</td>
                    <td>{{orderer}}</td>
                </tr>
                </tbody>
                <thead>
                <tr class="table-active">
                    <th>배송 주소</th>
                    <th>주문자 전화번호</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td style="width: 350px;">{{order.delivery_address}}</td>
                    <td>{{order.delivery_tel}}</td>
                </tr>
                </tbody>
                <thead>
                <tr class="table-active">
                    <th>주문번호</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{{order.order_no}}</td>
                </tr>
                </tbody>
            </table>
            <br>
        </div>
    </div>
</template>

<script>

    export default {
        name: "PurchaseSuccess",
        data() {
            return {
                choiceType : null,
                allow : false,
                Products : [],
                kind : [ 0 ],
                allprice : 0,
                user : {},
                order : {},
                orderer : '',
                pcode : '',
                ordernumber : this.$route.params.order,
                error : '',
                date : ''
            }
        },
        created() {
            this.$store.dispatch('GetProfile')
                .then( response => {
                    console.log('토큰검증 성공');
                    this.user = response.data.user;
                    let ordernum = {
                        orderno : this.ordernumber
                    };
                    return this.$store.dispatch('GetOrder', ordernum);
                })
                .then( response => {
                    console.log('get order : ' + JSON.stringify(response.data));
                    this.order = response.data.order[0];
                    this.date = new Date((this.order.trade_time *= 1));
                    let usernum = {
                        number : this.order.orderer
                    };
                    return this.$store.dispatch('FindUsername', usernum);
                })
                .then( response => {
                    console.log('response : ' + JSON.stringify(response.data));
                    this.orderer = response.data.result[0].name;
                })
                .catch( err => {
                    alert('잘못된 요청입니다.');
                    //this.$router.replace({ path : '/' });
                });
        }
    }
</script>

<style scoped>

</style>