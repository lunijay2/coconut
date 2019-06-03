<template>
    <div>
        <h1>마이 페이지입니다.</h1>
        <h2 v-if="user.name">{{ user.name }}님 환영합니다.</h2>
        <button @click="onSubmit" type="button" class="btn btn-primary">토큰 검증</button>
    </div>
</template>

<script>
    export default {
        name: "MyPage",
        data () {
            return {
                user : {}

            }
        },
        methods:{
            onSubmit() {
                this.$store.dispatch('GetProfile')
                    .then( response => {
                        alert('토큰검증 성공 : '+JSON.stringify(response.data.user));
                        console.log('토큰검증 성공');
                        this.user = response.data.user;
                    })
                    .catch( err => {
                        console.log('검증 실패' + err);
                        //alert(err);
                        this.$router.replace({path : '/Login'});
                    })
            }
        },
        created() {
            this.$store.dispatch('GetProfile')
                .then( response => {
                    alert('토큰검증 성공 : '+JSON.stringify(response.data.user));
                    console.log('토큰검증 성공');
                    this.user = response.data.user;
                })
                .catch( err => {
                    console.log('검증 실패' + err);
                    //alert(err);
                    this.$router.replace({path : '/Login'});
                })
        }
    }
</script>

<style scoped>

</style>