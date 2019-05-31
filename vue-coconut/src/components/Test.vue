<template>
    <div>
        <h1>결제테스트 페이지</h1>
        <!--<qrcode-vue :value="value" :size="size" level="H"></qrcode-vue>-->

        <p class="error">{{ error }}</p>

        <p class="decode-result">Last result: <b>{{ result }}</b></p>

        <qrcode-stream @decode="onDecode" @init="onInit" />
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
        },
        methods: {
            onDecode (result) {
                this.result = result
            },

            async onInit (promise) {
                try {
                    await promise
                } catch (error) {
                    if (error.name === 'NotAllowedError') {
                        this.error = "ERROR: you need to grant camera access permisson"
                    } else if (error.name === 'NotFoundError') {
                        this.error = "ERROR: no camera on this device"
                    } else if (error.name === 'NotSupportedError') {
                        this.error = "ERROR: secure context required (HTTPS, localhost)"
                    } else if (error.name === 'NotReadableError') {
                        this.error = "ERROR: is the camera already in use?"
                    } else if (error.name === 'OverconstrainedError') {
                        this.error = "ERROR: installed cameras are not suitable"
                    } else if (error.name === 'StreamApiNotSupportedError') {
                        this.error = "ERROR: Stream API is not supported in this browser"
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>