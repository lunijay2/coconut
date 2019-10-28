<template>
    <div v-if="choice == 'charge'">
        <h2>잔액 충전</h2>
        <hr noshade/>
        <br>
        <h5>충전 금액 입력</h5>
        <input type="number" v-model="money" class="form-control" placeholder="금액">
        <br>
        <button @click="MoneyChargeSubmit" type="button" class="btn btn-lg btn-primary float-right">잔액 충전</button>

    </div>
</template>

<script>
    export default {
        name: "MoneyCharge",
        data(){
            return {
                money : Number
            }
        },
        props: {
            choice : ''
        },
        watch : {
            choice : function (category) {
                if ( category == 'charge') {

                    this.LoadCheck = false;

                    this.$store.dispatch('GetProfile')
                        .then( response => {
                            console.log('토큰검증 성공');
                            this.user = response.data.user;
                            this.LoadCheck = true;
                        });
                }
            },
            money : function (chargemoney) {
                if (chargemoney < 0) {
                    this.money = 0;
                } else if (chargemoney > 1000000) {
                    this.money = 1000000;
                }
            }
        },
        methods : {
            MoneyChargeSubmit : function() {
                if (this.money <= 0) {
                    alert('0원보다 큰 금액만 충전 가능합니다.');
                    this.money = 0;
                } else if (this.money > 1000000) {
                    alert('최대 100만원까지 충전 가능합니다.');
                    this.money = 1000000;
                } else {

                    let money = {
                        id : this.user.number,
                        money : this.money
                    };
                    this.$store.dispatch('MoneyCharge', money)
                        .then( response => {
                            //console.log('response : '+JSON.stringify(response));
                            console.log('success');
                            alert( this.money.toLocaleString() + '원 충전되었습니다.');
                            this.money = Number;
                            this.$router.replace({path: '/'});
                        });
                }
            },
        }
    }
</script>

<style scoped>

</style>