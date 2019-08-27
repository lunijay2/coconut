<template>
    <div class="list-group" v-if="choice == 'all'">
        <h1>{{user.name}}님이 올린 상품</h1>
        <div v-for="product in Products">
            <a class="list-group-item list-group-item-action flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{product.name}}</h5>
                    <small class="text-muted">{{product.category}}</small>
                </div>
                <p class="mb-1">{{product.description}}</p>
                <small class="text-muted">{{product.price}}원</small>
            </a>
            <br>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MyCategory",
        props: {
            choice : ''
        },

        data () {
            return {
                user : {},
                Products : []
            }
        },
        methods : {
        },
        watch : {
            choice : function (category) {
                if ( category == 'all') {

                    this.$store.dispatch('GetProfile')
                        .then( response => {
                            console.log('토큰검증 성공');
                            let UserNumber = {
                                number : response.data.user.number
                            };
                            this.user = response.data.user;
                            return this.$store.dispatch('MyGetProduct', UserNumber);
                        })
                        .then( res => {
                            console.log('내가 올린 상품 성공 : '+JSON.stringify(res));
                            this.Products = res.data.Product;
                            console.log('내가 올린 상품 성공 : '+JSON.stringify(this.Products));
                        });
                }
                else {
                    console.log('내가 올린 상품 실패 : '+JSON.stringify(this.Products));
                }

            }
        }
    }
</script>

<style scoped>

</style>