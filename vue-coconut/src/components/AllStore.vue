<template>
    <div class="row">


       <div class="col-md-3"  v-for="store in stores">
            <div v-if="stores">

                <br><br>
                <div class="card border-primary mb-3" style="max-width: 20rem;">
                    <div class="card-header">{{store.company }}네 상점</div>
                    <div class="card-body">
                        <!-- <h4 class="card-title">{{ store.seller }}</h4>-->
                        <img style="height: 200px; width: 100%; display: block;" src="./store.svg" alt="Card image">
                        <button @click="FindProductSubmit(store.number)" type="button" class="btn btn-primary">상품보러가기</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AllStore",
        data () {
            return {
                stores : {},
                sendText: ''
            }
        },
        methods : {
            FindProductSubmit : function (store) {

                this.$EventBus.$emit('select', store);
                console.log('선택 상점 전송');
                store = '';
                this.$router.push({path: '/AllProduct'});
            }
        },
        created() {
            this.$store.dispatch('GetStore')
                .then( response => {
                    //alert('상점목록 성공 : '+JSON.stringify(response.data.store));
                    console.log('상점목록 성공');
                    this.stores = response.data.store;
                })
                .catch( err => {
                    console.log('상점목록 실패' + err);
                    //alert(err);
                    this.$router.replace({path : '/Login'});
                })
        }
    }
</script>

<style scoped>

</style>