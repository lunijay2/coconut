<template>
    <div>
        <form @submit="PaySubmit">
            <p class="error">{{ error }}</p>
            <!--<p class="decode-result">Last result: <b>{{ result }}</b></p>-->
            <qrcode-stream @decode="onDecode" @init="onInit" /><br><br>
            <!--<button v-if="result" type="submit" class="btn btn-primary">결제</button>-->
        </form>
        <div class="list-group">
            <a class="list-group-item list-group-item-action flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{result.order_no}}</h5>
                    <small class="text-muted">{{result.product}}</small>
                </div>
                <p class="mb-1">{{product.description}}</p>
                <small class="text-muted">{{result.price}}원</small>
            </a>
            <br>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Pay",
        data() {
            return {
                result : {},
                ordernumber : '',
                error : ''
            }
        },
        methods: {
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
                let jwt = '';
                let exit = false;
                let i = 0;//문자열에 한글자씩 접근하는 인덱스
                let j = 0;//0이면 주문번호, 1이면 jwt
                while(exit) {
                    if(this.ordernumber.charAt(i)) {
                        if(j==0) {
                            number = number + this.ordernumber.charAt(i);
                        }
                        else {
                            jwt = jwt + this.ordernumber.charAt(i);
                        }
                    }
                }
                const Payinfo = {
                    order_no : number,
                    token : jwt
                };
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
                this.$store.dispatch('GetOrder', ordernum)
                    .then( response => {
                        //alert('주문내역 성공 : '+JSON.stringify(response));
                        this.result = response.data.order[0];
                        console.log('주문내역 성공 : '+JSON.stringify(this.result));
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
</style>