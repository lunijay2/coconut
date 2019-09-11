<template>
    <div class="row" v-if="allow">
        <div class="col-md-2"></div>
        <div class="col-md-8">
            <h2>결제</h2>
            <hr noshade/>
            <table class="table">
                <thead>
                <tr class="table-active">
                    <th scope="col">상품정보</th>
                    <th scope="col">금액</th>
                    <th scope="col">수량</th>
                    <th scope="col">판매자</th>
                </tr>
                </thead>
                <tbody v-for="Pro in Products">
                <tr>
                    <td>
                        <div class="media">
                            <img v-bind:src="Pro.thumbnail" class="align-self-start mr-3 widthSet heightSet" />
                            <div class="media-body">
                                <h5 class="mt-0">{{Pro.name}}</h5>
                                <p class="text-muted">
                                    {{Pro.description}}<br>
                                    {{Pro.category}}
                                </p>
                            </div>
                        </div>
                    </td>
                    <td><h5>{{order.price.toLocaleString()}}원</h5></td>
                    <td><h5>{{pquan}}개</h5></td>
                    <td><h5>{{seller}}</h5></td>
                </tr>
                </tbody>
            </table>
            <br>
            <div class="row">
                <div class="col-md-6">
                    <button @click="nomalChoice" type="button" class="btn btn-lg btn-primary col-md-12">바로 결제</button>
                    <div v-if="choiceType==true">
                        <hr noshade/>
                        <div class="alert alert-warning" role="alert">
                            <h3 class="page-header">인증서 비밀번호 입력</h3>
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" class="form-control" name="password">
                            </div>
                            <button @click="" type="button" class="btn btn-primary align-self-center">결제</button>
                        </div>
                    </div>
                </div>
                <br>
                <div class="col-md-6">
                    <button @click="qrChoice" type="button" class="btn btn-lg btn-success col-md-12">QR코드 결제</button>
                    <div v-if="choiceType==false">
                        <hr noshade/>
                        <div class="alert alert-warning" role="alert">
                            <qrcode-vue :value="value" :size="size" level="H"></qrcode-vue>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import QrcodeVue from 'qrcode.vue';
    export default {
        name: "ChoicePayType",
        data () {
            return {
                value : {},
                size : 300,
                choiceType : null,
                allow : false,
                user : {},
                order : {},
                pcode : '',
                pquan : '',
                seller : '',
                pnum : {
                    orderno : this.$route.params.order
                },
                Products : [],
                //lnk : 'http://localhost:3000/img/',
                lnk : "/img/"
            }
        },
        methods : {
            imglnk : function () {
                for (var i=0; i<(this.Products.length); i++) {
                    this.Products[i].thumbnail = this.lnk+this.Products[i].thumbnail;
                }
            },
            nomalChoice : function () {
                this.choiceType = true;
            },
            qrChoice : function () {
                /*
                var v = {
                    no : this.order.order_no,
                    t : new Date().getTime()
                };
                */
                //this.value = JSON.stringify(v);
                //console.log('value : '+JSON.stringify(v));
                var v = this.order.order_no+'/'+new Date().getTime();
                console.log(v);
                this.choiceType = false;
            }
        },
        created() {
            this.$store.dispatch('GetProfile')
                .then( response => {
                    console.log('토큰검증 성공');
                    this.user = response.data.user;
                    return this.$store.dispatch('GetOrder', this.pnum);
                })
                .then( response => {
                    console.log('get order : '+JSON.stringify(response.data));
                    this.order = response.data.order[0];
                    var p = response.data.order[0].product;
                    //이부분은 여러 상품을 구매할 경우 반복문 필요
                    var pArray = p.split('/');
                    var pcode = {
                        productcode : pArray[0]
                    };
                    this.pcode = pArray[0];
                    this.pquan = pArray[1];
                    return this.$store.dispatch('GetProductDetail', pcode);
                })
                .then( response => {
                    console.log('product detail : '+JSON.stringify(response.data));
                    this.Products = response.data.result;
                    this.seller = response.data.result[0].seller;
                    this.imglnk();
                    if (this.user.number == this.order.orderer) {
                        this.allow = true;
                    } else {
                        alert('잘못된 요청입니다.');
                        this.$router.replace({ path : '/' });
                    }
                })
                .catch( err => {
                    alert('잘못된 요청입니다.');
                    this.$router.replace({ path : '/' });
                });
        },
        computed : {
        },
        watch : {
        },
        components: {
            QrcodeVue
        }
    }
</script>

<style scoped>
    .widthSet {
        max-width: 80px;
    }
    .heightSet {
        max-height: 80px;
    }
    /*
	Max width before this PARTICULAR table gets nasty. This query will take effect for any screen smaller than 760px and also iPads specifically.
	*/
    @media
    only screen
    and (max-width: 768px), (min-device-width: 768px)
    and (max-device-width: 1024px)  {

        /* Force table to not be like tables anymore */
        table, thead, tbody, th, td, tr {
            display: block;
        }

        /* Hide table headers (but not display: none;, for accessibility) */
        thead tr {
            position: absolute;
            top: -9999px;
            left: -9999px;
        }

        tr {
            margin: 0 0 1rem 0;
        }

        tr:nth-child(odd) {
            background: #ccc;
        }

        td {
            /* Behave  like a "row" */
            border: none;
            border-bottom: 1px solid #eee;
            position: relative;
            padding-left: 50%;
        }

        td:before {
            /* Now like a table header */
            position: absolute;
            /* Top/left values mimic padding */
            top: 0;
            left: 6px;
            width: 45%;
            padding-right: 10px;
            white-space: nowrap;
        }

        /*
        Label the data
    You could also use a data-* attribute and content for this. That way "bloats" the HTML, this way means you need to keep HTML and CSS in sync. Lea Verou has a clever way to handle with text-shadow.
        */
        td:nth-of-type(1):before { content: "상품정보"; }
        td:nth-of-type(2):before { content: "금액"; }
        td:nth-of-type(3):before { content: "수량"; }
        td:nth-of-type(4):before { content: "판매자"; }
    }
</style>