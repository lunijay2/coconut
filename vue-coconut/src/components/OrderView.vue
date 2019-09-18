<template>
    <div class="list-group" v-if="choice == 'order'">
        <h1>주문내역</h1>
        <div v-for="product in Products">
            <a class="list-group-item list-group-item-action flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{product.productname}}</h5>
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
        name: "OrderView",
        props: {
            choice : ''
        },
        data () {
            return {
                user : {},
                order : {},
                Products : [],
                kind : [ 0 ],
                allprice : 0,
                choiceType : null,
                allow : false,
                pcode : '',
                pquan : [],
                seller : '',
                pnum : {
                    orderno : this.$route.params.order
                },
                lnk : 'http://localhost:3000/img/',
                //lnk : "/img/"
            }
        },
        methods : {
        },
        watch : {
            choice : function (category) {
                if ( category == 'order') {
                    this.$store.dispatch('GetProfile')
                        .then( response => {
                            console.log('토큰검증 성공');
                            let UserNumber = {
                                number : response.data.user.number
                            };
                            this.user = response.data.user;

                            return this.$store.dispatch('GetOrder_3', this.user);
                        })
                        .then( response => {
                            console.log('get order : '+JSON.stringify(response.data));
                            this.order = response.data.order;
                            var p = new Array;
                            var p1 = new Array;
                            var p2 = new Array;
                            var p3 = new Array;
                            for (var i=0; i<response.data.order.length; i++) {
                                p.push(response.data.order[i].product);
                                console.log('pro'+ i +' : '+response.data.order[i].product);
                                console.log('p : '+JSON.stringify(p));
                            }
                            p1 = p.split(",");
                            console.log('p1 : '+JSON.stringify(p1));

                            for (var i=0; i<p1.length; i++) {

                                for (var j=0; j<p1.length; j++) {
                                    p2.push(p1[i].split('/'));
                                    p3.push(p2[i][1]);
                                }
                            }

                            console.log('p2 : '+JSON.stringify(p2));
                            console.log('p3 : '+JSON.stringify(p3));

                            this.pquan = p2;

                            var pcode2 = {
                                productcode : p2
                            };
                            console.log("pcode2 : "+JSON.stringify(pcode2));
                            return this.$store.dispatch('GetProductDetail2', pcode2);
                        })
                        .then( response => {
                            console.log('product detail : '+JSON.stringify(response.data));
                            let pp = response.data.result;
                            for (let i=0; i<pp.length; i++) {
                                for(let j=0; j<pp.length; j++) {
                                    this.pquan[i][j] *= 1;
                                    console.log('pp '+i+' : '+pp[i].productcode);
                                    console.log('pquan '+j+' : '+ this.pquan[j][0]);
                                    if(pp[i].productcode == this.pquan[j][0]) {
                                        pp[i].oquantity = this.pquan[j][1];
                                        console.log('일치');
                                    } else {
                                        console.log('불일치');
                                    }
                                }
                            }
                            this.Products = pp;
                            this.seller = response.data.result[0].seller;
                            this.imglnk();
                            //this.quantityAppend(response.data.result);
                            console.log('product detail2 : '+JSON.stringify(this.Products));
                            if (this.user.number == this.order.orderer) {
                                this.allow = true;
                            } else {
                                console.log('잘못된 요청입니다.');
                                //alert('잘못된 요청입니다.');
                                //this.$router.replace({ path : '/' });
                            }
                        })
                        .finally( () => {
                            this.kind[0] = this.Products.length;
                            this.kind[1] = 0;
                            for (let i=0; i<this.Products.length; i++){
                                this.allprice = this.allprice + this.Products[i].oquantity * this.Products[i].price;
                                this.Products[i].oquantity *= 1; //스트링을 정수로 형변환
                                this.kind[1] = this.kind[1] + this.Products[i].oquantity;
                            }
                        })
                        .catch( err => {
                            //alert('잘못된 요청입니다.');
                            console.log('잘못된 요청입니다. : '+err);
                            //this.$router.replace({ path : '/' });
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