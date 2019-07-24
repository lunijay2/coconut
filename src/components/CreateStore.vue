<template>
    <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
            <h2>{{newStore.seller}}</h2>
            <h2>상품 등록</h2>
            <h2>상점 등록도 같이 됩니당</h2>
            <div class="form-group row">
                <label for="name" class="col-sm-2 col-form-label">상품명</label>
                <div class="col-sm-10">
                    <input type="text" id="name" v-model="newStore.name" class="form-control" >
                </div>
                <br><br><br>

                <label for="price" class="col-sm-2 col-form-label">가격</label>
                <div class="col-sm-10">
                    <input type="text" id="price" v-model="newStore.price" class="form-control" >
                </div>
                <br><br><br>

                <label for="quantity" class="col-sm-2 col-form-label">수량</label>
                <div class="col-sm-10">
                    <input type="text" id="quantity" v-model="newStore.quantity" class="form-control">
                </div>
                <br><br><br>

                <label for="exampleSelect" class="col-sm-2 col-form-label">카테고리</label>
                <select class="form-control col-sm-10" id="exampleSelect" v-model="newStore.category">
                    <option value="의류">의류</option>
                    <option value="식품">식품</option>
                    <option value="생활용품">생활용품</option>
                    <option value="가전디지털">가전디지털</option>
                    <option value="스포츠/레저">스포츠/레저</option>
                    <option value="자동차용품">자동차용품</option>
                    <option value="도서/음반/DVD">도서/음반/DVD</option>
                    <option value="완구/취미">완구/취미</option>
                    <option value="문구/오피스">문구/오피스</option>
                    <option value="반려동물용품">반려동물용품</option>
                    <option value="뷰티">뷰티</option>
                    <option value="출산/유아동">출산/유아동</option>
                    <option value="주방용품">주방용품</option>
                </select>
                <br><br><br>

                <label for="description" class="col-sm-2 col-form-label">설명</label>
                <div class="col-sm-10">
                    <input type="text" id="description" v-model="newStore.description" class="form-control">
                </div>
            </div>
            <button @click="newStoreSubmit" type="button" class="btn btn-primary">상품등록</button>
            <div class="col-md-3"></div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "CreateStore",
        data(){
            return {
                newStore : {
                    name: '',
                    price: '',
                    quantity: '',
                    category: '',
                    description: '',
                    seller: '',
                    number : '',
                }
            }
        },
        methods : {
            newStoreSubmit : function () {
                this.$axios.post('http://localhost:3000/stores/newStore', this.newStore )
                //this.$axios.post('/users/register', this.newUser )
                    .then((response) => {
                        if(response.data.success == true) {
                            alert('상품 등록 성공');
                            console.log('상품 등록 성공');
                            this.$router.replace({ path : '/' });
                        } else {
                            alert('상품 등록 실패(에러없음)');
                            console.log('상품 등록 실패(에러없음)')
                        }
                    }). catch((err) => {
                    console.log("Error! : ", err);
                    console.log('상품 등록 실패');
                })
            }
        },

        created() {
            this.$store.dispatch('GetProfile')
                .then( response => {
                    //alert('토큰검증 성공 : '+JSON.stringify(response.data.user));
                    console.log('토큰검증 성공');
                    //console.log('response : '+JSON.stringify(response));
                    if( 0 == response.data.user.indi) {
                        let UserNumber = {
                            number : response.data.user.number
                        };
                        return this.$store.dispatch('FoundEnt', UserNumber);
                    } else {
                        console.log('기업 검증 실패');
                        alert('기업 검증 실패');
                        this.$store.dispatch('LOGOUT');
                        this.$router.replace({path : '/Login'});
                    }
                })
                .then( res => {
                    //console.log('res : '+JSON.stringify(res));
                    if (res.data.store.seller === 1) {
                        this.newStore.seller = res.data.store.company;
                        this.newStore.number = res.data.store.number;
                        console.log('판매자 검증 성공');
                    } else {
                        console.log('판매자 검증 실패');
                        alert('판매자 검증 실패');
                        this.$store.dispatch('LOGOUT');
                        this.$router.replace({path : '/Login'});
                    }
                })
                .catch( err => {
                    console.log('검증 실패' + err);
                    //alert(err);
                    this.$store.dispatch('LOGOUT');
                    this.$router.replace({path : '/Login'});
                })
        }
    }
</script>

<style scoped>

</style>