<template>
    <div class="row">
        <div class="col-md-3" v-for="Product in Products">

            <div v-if="Product.user_number" >

                <br><br>
                <div class="card border-primary mb-3" style="max-width: 20rem;">
                    <div class="card-header">{{ Product.name }}</div>
                    <div class="card-body">
                        <h4 class="card-title">{{ Product.seller }}</h4>
                        <p class="card-text">{{ Product.description }}</p>
                        <p class="card-text">{{ Product.category }}</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AllProduct",
        data () {
            return {
                Products : {}
            }
        },
        created() {
            this.$EventBus.$on('select')
                .then( text => {
                    console.log('선택 상품목록 시작');
                    let selectStore = {
                        store: text
                    };
                    return this.$store.dispatch('FindProduct', selectStore)
                })
                .then( response => {
                    //alert('상품목록 성공 : '+JSON.stringify(response));
                    console.log('선택 상품목록 성공 : '+JSON.stringify(response));
                    this.Products = response.data.Product;
                })
                .catch( err => {
                    console.log('선택 상품목록 실패' + err);
                    //alert(err);
                    //this.$router.replace({path : '/Login'});
                })
            /*
            this.$EventBus.$on('select', text => {
                if(text == '') {
                    console.log('전체 상품목록 시작');
                    this.$store.dispatch('GetProduct')
                        .then( response => {
                            //alert('상품목록 성공 : '+JSON.stringify(response.data.Product));
                            console.log('전체 상품목록 성공');
                            this.Products = response.data.Product;
                        })
                        .catch( err => {
                            console.log('전체 상품목록 실패' + err);
                            //alert(err);
                            //this.$router.replace({path : '/Login'});
                        })
                } else {
                    console.log('선택 상품목록 시작');
                    let selectStore = {
                        store : text
                    };
                    this.$store.dispatch('FindProduct', selectStore)
                        .then( response => {
                            //alert('상품목록 성공 : '+JSON.stringify(response));
                            console.log('선택 상품목록 성공');
                            this.Products = response.data.Product;
                        })
                        .catch( err => {
                            console.log('선택 상품목록 실패' + err);
                            //alert(err);
                            //this.$router.replace({path : '/Login'});
                        })
                }
            });
             */

        }
    }
</script>

<style scoped>

</style>