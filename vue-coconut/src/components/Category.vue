<template>
    <div class="list-group">
        <div v-for="product in Products">
            <a class="list-group-item list-grou+55p-item-action flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between row">
                    <div class="col-md-3">
                        <img v-bind:src="product.thumbnail" class="widthSet heightSet" />
                    </div>
                    <div class="col-md-4">
                        <h5><router-link :to="'/DetailProduct/'+product.productcode" class="nav-link">{{product.name}}</router-link></h5>
                        <!--<h6>{{product.description}}</h6>-->
                        <p></p>
                        <small class="text-muted col-md-1">{{product.category}}</small>
                    </div>
                    <div class="col-md-3">
                        <h5><strong class="text-black">{{(product.price).toLocaleString()}}원</strong></h5>
                    </div>
                    <div class="col-md-2">

                    </div>

                    <!--
                    <div class="col-md-3">

                    </div>

                    <div>
                        <img src="http://item.ssgcdn.com/46/13/29/item/1000034291346_i1_1200.jpg" class="widthSet heightSet" />
                    </div>
                    <div class="row">
                        <div class="col-md-9">
                            <h5><router-link :to="'/DetailProduct/'+product.productcode" class="nav-link">{{product.name}}</router-link></h5>
                        </div>
                        <div class="col-md-3">
                            <h5><strong class="text-black">{{product.price}}원</strong></h5>
                        </div>
                        <div class="col-md-1"></div>
                        <div class="col-md-8">
                            <p>{{product.description}}</p>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted">{{product.category}}</small>
                        </div>
                    </div>
                    -->
                </div>
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
                Products : [],
                //lnk : "http://localhost:3000/img/"
                lnk : "/img/"
            }
        },
        methods : {
            imglnk : function () {
                for (var i=0; i<(this.Products.length); i++) {
                    this.Products[i].thumbnail = this.lnk+this.Products[i].thumbnail;
                }
            }
        },
        created() {
            this.choice = 'all';
        },
        computed : {
            /*
            imglnk2 : function () {
                for (var i=0; i<(this.Products.length); i++) {
                    return this.lnk+this.Products[i].thumbnail;
                }
            }*/
        },
        watch : {
            choice : function (category) {
                if ( category == 'all') {
                    this.$store.dispatch('GetProduct')
                        .then( response => {
                            //alert('카테고리 결과 2 : '+JSON.stringify(response));
                            this.Products = response.data.Product;
                            this.imglnk();
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
    .widthSet {
        max-width: 150px;
    }
    .heightSet {
        max-height: 150px;
    }
    /*
    img.border-shadow{
        border:0px solid #888888;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }*/
    .imageBox{
        max-width: 100px;
        max-height: 100px;
        border:0px solid #888888;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
</style>