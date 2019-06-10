<template>
    <div>
        <h1>결제테스트 페이지</h1>
        <qrcode-vue :value="value" :size="size" level="H"></qrcode-vue>
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
    },
    components: {
        QrcodeVue
        }
    }
</script>

<style scoped>

</style>