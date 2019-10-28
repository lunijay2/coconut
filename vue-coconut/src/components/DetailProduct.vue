<template>
    <div>
        <div v-if="LoadCheck == false">
            <h2>로딩 중...</h2>
        </div>
        <div class="row" v-if="LoadCheck == true">
            <div class="col-md-6">
                <div class="imageBox">
                    <img :src="imageBlob" class="widthSet heightSet" />
                </div>
            </div>
            <div class="col-md-1">
                <br>
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
                            <br>
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
                    </tr>
                </table>
                <button class="btn btn-sm btn-outline-dark col-sm-1" style="width: 12%; height: 30px;" @click="decreaseQuantity" type="button">-</button>
                <input class="col-sm-2" type="text" style="width: 15%; height: 31px;" maxlength="2" title="수량" value="1" v-model="quantity">
                <button class="btn btn-sm btn-outline-dark col-sm-1" style="width: 12%; height: 30px;" @click="increaseQuantity" type="button">+</button>
                <br><br>
                <h5>총 상품금액 {{(Product.price*quantity).toLocaleString()}}원</h5>
                <br>
                <button @click="addBasketSubmit" type="button" class="btn btn-block btn-lg btn-outline-success">장바구니</button>
                <button @click="CreateOrderSubmit" type="button" class="btn btn-block btn-lg btn-primary">바로구매</button>
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
                imageBlob : '',
                LoadCheck : false,
            }
        },
        created() {

            this.LoadCheck = false;

            let product = {
                productcode : this.$route.params.product
            };
            this.$store.dispatch('GetProductDetail', product)
                .then( response => {
                    //alert('성공 : '+JSON.stringify(response.data.user));
                    //console.log('성공');
                    //console.log('response : '+JSON.stringify(response));
                    this.Products = response.data.result;
                    this.Product = this.Products[0];

                    //this.imageThumbnail = "http://localhost:3000\\img\\"+this.Product.thumbnail;
                    //this.imageThumbnail = "/img/"+this.Product.thumbnail;

                    const contentType = 'image/png';
                    /*

                    const b64Data = '';
                    const blob = new Blob(this.Products.image.data, {type: contentType});
                    const blobUrl = URL.createObjectURL(blob);
                    window.location = blobUrl;


                    var blob = new Blob(this.Product.image, {type: contentType});
                    // Define the FileReader which is able to read the contents of Blob
                    var reader = new FileReader();

                    // The magic always begins after the Blob is successfully loaded
                    reader.onload = function () {
                        // Since it contains the Data URI, we should remove the prefix and keep only Base64 string
                        var b64 = reader.result.replace(/^data:.+;base64,/, '');
                        console.log(b64); //-> "V2VsY29tZSB0byA8Yj5iYXNlNjQuZ3VydTwvYj4h"

                        // Decode the Base64 string and show result just to make sure that everything is OK
                        var html = atob(b64);
                        console.log(html); //-> "Welcome to <b>base64.guru</b>!"
                    };

                    // Since everything is set up, let’s read the Blob and store the result as Data URI
                    //this.imageBlob = reader.readAsDataURL(blob);

                    var bytes = new Uint8Array(this.Products.image);
                    var blob = new Blob([bytes], {type:'image/jpg'});
                    var data01 =  URL.createObjectURL(blob);
                    this.imageBlob = data01;
                    */

                    //this.imageBlob = this.Products.data.map(b => String.fromCharCode(b)).join('');
                    //this.imageBlob = 'data:image/jpeg;base64,' + this.hexToBase64(this.Product.image.data);

                    var bytes = new Uint8Array(this.Product.image.data);
                    var blob = new Blob([bytes], {type:'image/png'});
                    this.imageBlob = URL.createObjectURL(blob);

                    this.LoadCheck = true;

                });
        },
        computed : {
            dataUrl(){
                return 'data:image/jpeg;base64,' + btoa(
                    new Uint8Array(this.Products.image)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
            }
        },
        methods : {
            hexToBase64 : function(str) {
                return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
            },
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
                            alert('장바구니에 추가되었습니다');
                            console.log('add Basket Success');
                        } else {
                            alert('장바구니에 넣지 못했습니다');
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
        max-width: 100%;
    }
    .heightSet {
        max-height: 100%;
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

    @media
    only screen
    and (max-width: 768px), (min-device-width: 768px)
    and (max-device-width: 1024px)  {

        /* Force table to not be like tables anymore */
        .imageBox{
            max-width: 100%;
            border:0px solid #888888;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        }

    }
</style>