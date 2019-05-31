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
            value :"1, JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im51bWJlciI6MSwibmFtZSI6IuycpOygleuvvCIsImlkIjoiamJ1MDAxIiwicGFzc3dvcmQiOiIkMmEkMTAkMmlTckEvdTJTMllISU5vOG1xNkpFT3hhYTlYWEJrQjVpQ2c2NEJTR1dXUm9LajlDY2hqbHEiLCJ0ZWwiOiIwMTAyMDA3NTEwMiIsImFkZHIiOiLshJzsmrjsi5wg7ISc64yA66y46rWsIiwiZW1haWwiOiJqYnUwMDFAZ21haWwuY29tIiwiaW5kaSI6MX0sImlhdCI6MTU1OTI3Nzk2NywiZXhwIjoxNTU5ODgyNzY3fQ.3sbt8t4equZz-9KrwQzWKu5jmHMX8JieAjZrRmmnRas",
            size : 200
        }
    },
    components: {
        QrcodeVue
        }
    }
</script>

<style scoped>

</style>