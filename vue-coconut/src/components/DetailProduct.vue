<template>
    <div>
        <div class="row">
            <div class="col-md-6">
                <div class="imageBox">
                    <img v-bind:src="imageThumbnail" class="widthSet heightSet" />
                </div>
            </div>
            <div class="col-md-1">
            </div>
            <div class="col-md-5">
                <br><br>
                <table border="0">
                    <tr>
                        <td>
                            <h3 class="float-left"><strong>{{Product.productname}}</strong></h3>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h5 class="float-left text-muted">{{Product.description}}</h5>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h6 class="float-left"><b>남은 수량 : {{Product.allquantity.toLocaleString()}}개</b></h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3 class="float-left">{{Product.price.toLocaleString()}}원</h3>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <br>
                        </td>
                    </tr><tr>
                    <td>
                        <br>
                    </td>
                </tr><tr>
                    <td>
                        <br>
                    </td>
                </tr>
                </table>
                <table border="0">
                    <tr>
                        <td class="row">
                            <button class="btn btn-sm btn-outline-dark float-left col-md-1" @click="decreaseQuantity" type="button">-</button>
                            <input class="col-md-1" type="text" maxlength="2" title="수량" value="1" v-model="quantity">
                            <button class="btn btn-sm btn-outline-dark float-right col-md-1" @click="increaseQuantity" type="button">+</button>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td colspan="2"></td>
                    </tr>
                </table>
                <h6>총 상품금액 {{(Product.price*quantity).toLocaleString()}}원</h6>
                <table border="0">
                    <tr>
                        <td>
                            <button @click="addBasketSubmit" type="button" class="btn btn-block btn-lg btn-outline-success col-md-6">장바구니</button>
                        </td>
                        <td>
                            <button @click="CreateOrderSubmit" type="button" class="btn btn-block btn-lg btn-primary col-md-6">바로구매</button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DetailProduct",
        data () {
            return {
                Products : [],
                Product : {},
                imageThumbnail :'',
                quantity : 1,
            }
        },
        created() {
            let product = {
                productcode : this.$route.params.product
            };
            this.$store.dispatch('GetProductDetail', product)
                .then( response => {
                    //alert('성공 : '+JSON.stringify(response.data.user));
                    console.log('성공');
                    console.log('response : '+JSON.stringify(response));
                    this.Products = response.data.result;
                    this.Product = this.Products[0];

                    //this.imageThumbnail = "http://localhost:3000\\img\\"+this.Product.thumbnail;
                    this.imageThumbnail = "/img/"+this.Product.thumbnail;
                });
        },
        methods : {
            decreaseQuantity : function() {
                if(this.quantity <= 1) {
                    this.quantity = 1;
                    alert('최소 수량은 1개입니다.');
                } else {
                    this.quantity --;
                }
            },
            increaseQuantity : function() {
                if(this.quantity < 99) {
                    this.quantity ++;
                } else {
                    alert('최대 수량은 99개입니다.');
                }
            },
            addBasketSubmit : function () {
                this.$store.dispatch('GetProfile')
                    .then( response => {
                        console.log('토큰검증 성공'+JSON.stringify(response.data.user));

                        let selectProduct = {
                            userid : response.data.user.id,
                            seller : this.Product.seller,
                            price : this.Product.price,
                            productcode : this.Product.productcode,
                            quantity : this.quantity,
                            productname : this.Product.productname
                        };

                        console.log(JSON.stringify(selectProduct));

                        return this.$store.dispatch('addBasket', selectProduct);
                    }, err => {
                        console.log('검증 실패' + err);
                        alert(err);
                        this.$store.dispatch('LOGOUT');
                        this.$router.replace({path : '/Login'});
                    })
                    .then( response => {
                        if(response.data.success == true) {
                            alert('add Basket Success');
                            console.log('add Basket Success');
                        } else {
                            alert('add Basket Failure');
                            console.log('add Basket Failure')
                        }
                    }).catch( err => {
                    console.log('add Basket Err : '+ err);
                });
            },
            CreateOrderSubmit : function () {
                var arr = [];

                var a = String(this.Product.productcode);
                var b = String(this.quantity);

                console.log("number"+a);
                let ab = String(a+'&'+b);
                arr.push(ab);
                this.$router.push({ path : '/CreateOrder/'+1+'/'+arr });
                console.log("product"+JSON.stringify(this.Product));
                /*
                this.$router.push({ path : '/CreateOrder/'+this.$route.params.product+'/'+this.quantity });
                 */
            }
        }

    }
</script>

<style scoped>
    .tab {
        padding-left: 1.8em;
    }
    .productgroup {
        width: 1280px;
        position: absolute;
        top: 250px;
        left: 18%;
        //background: #fff;
        //transform: translate(-50%, -50%)
    }
    .widthSet {
        max-width: 498px;
    }
    .heightSet {
        max-height: 498px;
    }
    /*
    img.border-shadow{
        border:0px solid #888888;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }*/
    .imageBox{
        max-width: 500px;
        max-height: 500px;
        border:0px solid #888888;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
</style>