<template>
    <div>
        <h1>결제테스트 페이지</h1>
        <qrcode-vue :value="value1" :size="size" level="H"></qrcode-vue>
        <br><br><br>
        <qrcode-vue :value="value2" :size="size" level="H"></qrcode-vue>
    </div>
</template>

<script>
    import QrcodeVue from 'qrcode.vue';
    let token = localStorage.getItem('pToken');
    export default {
        name: "Test",
    data() {

        return {
            value1 : '1',
            value2 : '2',
            size : 300
        }
    },
    components: {
        QrcodeVue
        }
    }
</script>

<style scoped>

</style>