<template>
    <div>
        <h1>결제페이지 바로가기</h1><br>
        <qrcode-vue :value="value" :size="size" level="H"></qrcode-vue>
    </div>
</template>

<script>
    import QrcodeVue from 'qrcode.vue';
    export default {
        name: "Home",
        data() {
            return {
                value : 'https://coconutpay.herokuapp.com',
                size : 120
            }
        },
        components: {
            QrcodeVue
        }
    }
</script>

<style scoped>

</style>