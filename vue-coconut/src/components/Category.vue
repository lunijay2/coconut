<template>
    <div class="list-group">
        <div v-for="product in Products">
            <a class="list-group-item list-grou+55p-item-action flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">
                        <router-link :to="'/DetailProduct/'+product.productcode" class="nav-link">
                            {{product.name}}
                        </router-link>
                    </h5>
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
        name: "Category",
        props: {
            choice : ''
        },
        data () {
            return {
                Products : []
            }
        },
        methods : {
        },
        created() {
            this.choice = 'all';
        },
        watch : {
            choice : function (category) {
                if ( category == 'all') {
                    this.$store.dispatch('GetProduct')
                        .then( response => {
                            //alert('카테고리 결과 2 : '+JSON.stringify(response));
                            this.Products = response.data.Product;
                            console.log('카테고리 성공 1 : '+JSON.stringify(this.Products));
                            console.log('카테고리 성공 1');
                        })
                        .catch( err => {
                            console.log('카테고리 실패 1 : ' + err);
                            //alert(err);
                        })
                } else {
                    let selectCategory = {
                        category : category
                    };
                    this.$store.dispatch('FindCategory', selectCategory)
                        .then( response => {
                            //alert('카테고리 결과 3 : '+JSON.stringify(response));
                            this.Products = response.data.Product;
                            console.log('카테고리 성공 3 : '+JSON.stringify(this.Products));
                        })
                        .catch( err => {
                            console.log('카테고리 실패 3 : ' + err);
                            //alert(err);
                        })
                }

            }
        }
    }
</script>

<style scoped>

</style>