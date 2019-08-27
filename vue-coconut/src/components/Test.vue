<template>
    <div>
        <h1>결제테스트 페이지</h1>
        <qrcode-vue :value="value" :size="size" level="H"></qrcode-vue>
        <button @click="onNextSubmit" type="button"  class="btn btn-primary">QR코드 변경</button>
    </div>
</template>

<script>
    import QrcodeVue from 'qrcode.vue';
    let token = localStorage.getItem('pToken');
    export default {
        name: "Test",
    data() {
        return {
            value : '1',
            size : 300
        }
    }, methods: {
            onNextSubmit : function () {
                if(this.value == '1') {
                    this.value = '2';
                } else {
                    this.value = '1';
                }

            }
        },
    components: {
        QrcodeVue
        }
    }
</script>

<style scoped>

</style>