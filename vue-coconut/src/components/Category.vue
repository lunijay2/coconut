<template>
    <div class="list-group">
        <div v-for="product in Products">
            <a class="list-group-item list-grou+55p-item-action flex-column align-items-start">
                <div class="w-100 justify-content-between row">
                    <div class="col-md-3" style="width: 20%;">
                        <router-link :to="'/DetailProduct/'+product.productcode" style="color: black" >
                            <img :src="product.imageBlob" class="widthSet heightSet" style="text-align:center;" />
                            <!--
                            <img v-bind:src="product.thumbnail" class="widthSet heightSet" style="text-align:center;" />
                            -->
                        </router-link>
                    </div>
                    <div class="col-md-9 row" style="width: 80%;">
                        <div class="col-md-7">
                            <router-link :to="'/DetailProduct/'+product.productcode" style="color: black" >
                                <h5>{{product.productname}}</h5>
                            </router-link>
                            <small class="text-muted">{{product.category}}</small>
                            <h5>
                                <strong class="text-black">{{(product.price).toLocaleString()}}원</strong>
                            </h5>
                        </div>
                        <div class="col-md-5 di">
                            <h5><strong class="text-black">판매자</strong></h5>
                            <h6>{{(product.seller)}}</h6>
                        </div>

                        <!-- <h6 class="text-muted col-sm-12">{{product.description}}</h6>-->
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
                //imageBlob : [],
                //lnk : "http://localhost:3000/img/"
                lnk : "/img/"
            }
        },
        methods : {
            imglnk : function () {
                for (var i=0; i<(this.Products.length); i++) {
                    var bytes = new Uint8Array(this.Products[i].image.data);
                    var blob = new Blob([bytes], {type:'image/png'});
                    this.Products[i].imageBlob = URL.createObjectURL(blob);
                    //this.Products[i].thumbnail = this.lnk+this.Products[i].thumbnail;
                }
            }
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
                            this.imglnk();
                            //console.log('카테고리 성공 1 : '+JSON.stringify(this.Products));
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
                            this.imglnk();
                            console.log('카테고리 성공 3');
                            //console.log('카테고리 성공 3 : '+JSON.stringify(this.Products));
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
        max-width: 88px;
    }
    .heightSet {
        max-height: 88px;
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


    @media
    only screen
    and (max-width: 768px), (min-device-width: 768px)
    and (max-device-width: 1024px)  {

        /* Force table to not be like tables anymore */
        .widthSet {
            max-width: 80px;
        }

        .di[disabled]{}

    }

</style>