<template>
    <div v-if="choice == 'Create'">
        <h2>상품 등록</h2>
        <br>
        <div class="form-group row">
            <label for="name" class="col-md-2 col-form-label">상품명</label>
            <div class="col-md-10">
                <input type="text" id="name" v-model="newStore.name" class="form-control" >
            </div>
            <br><br><br>
            <label for="price" class="col-md-2 col-form-label">가격</label>
            <div class="col-md-10">
                <input type="text" id="price" v-model="newStore.price" class="form-control" >
            </div>
            <br><br><br>
            <label for="quantity" class="col-md-2 col-form-label">수량</label>
            <div class="col-md-10">
                <input type="text" id="quantity" v-model="newStore.quantity" class="form-control">
            </div>
            <br><br><br>
                <label for="exampleSelect" class="col-md-2 col-form-label">카테고리</label>
                <div class="col-md-10">
                <select class="form-control" id="exampleSelect" v-model="newStore.category">
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
                </div>
                <br><br><br>

                <label for="description" class="col-md-2 col-form-label">설명</label>
                <div class="col-md-10">
                    <input type="text" id="description" v-model="newStore.description" class="form-control">
                </div>
                <br><br><br>
                <label for="description" class="col-md-2 col-form-label">이미지</label>
                <div class="col-md-10">
                    <div id="app">
                        <file-pond
                                name="bin"
                                ref="pond"
                                label-idle="마우스로 이미지 파일을 끌어오거나 <strong><span class='filepond--label-action'>직접 첨부</span></strong>"
                                allow-multiple="false"
                                v-bind:instantUpload="instanceFlag"
                                max-files="1"
                                v-bind:server="server"
                                accepted-file-types="image/jpeg, image/png"
                                v-on:init="handleFilePondInit"
                                v-on:processfile="onload"
                        />
                    </div>
                    <br>
                    <button @click="newStoreSubmit" type="button" class="btn btn-primary btn-lg col-md-12">상품등록</button>
                </div>
            </div>
    </div>
</template>

<script>

    import vueFilePond from 'vue-filepond'
    // Import FilePond styles
    import 'filepond/dist/filepond.min.css'
    // Import FilePond plugins
    // Please note that you need to install these plugins separately
    // Import image preview plugin styles
    import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
    // Import image preview and file type validation plugins
    import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
    import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
    // Create component
    const FilePond = vueFilePond(
        FilePondPluginFileValidateType,
        FilePondPluginImagePreview
    );
    export default {
        name: "CreateStore",
        data(){
            return {
                server: {
                    //url: "http://localhost:3000/users/imgupload",
                    url: `/users/imgupload`,
                    process: {
                        headers: {
                            Authorization : this.$store.state.pToken
                        }
                    }
                },
                newStore : {
                    name: '',
                    price: '',
                    quantity: '',
                    category: '',
                    description: '',
                    seller: '',
                    number : '',
                    image : ''
                },
                instanceFlag : true
            }
        },
        props: {
            choice : ''
        },
        watch : {
            choice : function (category) {
                if ( category == 'Create') {
                    this.$store.dispatch('GetProfile')
                        .then( response => {
                            //alert('토큰검증 성공 : '+JSON.stringify(response.data.user));
                            console.log('토큰검증 성공');
                            //console.log('response : '+JSON.stringify(response));
                            if( response.data.user.indi == 0) {
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
                        .then( (res) => {
                            if (res.data.store.seller == 1) {
                                this.server.process.headers = this.$store.state.pToken;
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
        },
        methods : {
            newStoreSubmit : function () {
                this.$store.dispatch('NewProduct', this.newStore)
                    .then( response => {
                        if(response.data.success == true) {
                            alert('상품 등록 성공');
                            console.log('상품 등록 성공');
                            this.$router.replace({ path : '/AllProduct' });
                        } else {
                            alert('상품 등록 실패 1');
                            console.log('상품 등록 실패 1');
                        }
                    }). catch((err) => {
                        alert('상품 등록 실패 2');
                        console.log('상품 등록 실패 2');
                    });
            },
            handleFilePondInit: function() {
                console.log('FilePond has initialized'+this.$refs.pond);
                // FilePond instance methods are available on `this.$refs.pond`
            },
            onload : function (e, r) {
                if (e) {
                    console.log(e);
                } else {
                    console.log(r);
                    console.log(r.serverId.filename);
                    console.log(r.fileExtension);
                    console.log(r.serverId);
                    var link = r.serverId;
                    this.newStore.image = link;
                    console.log("img : "+ this.newStore.image);
                }
            }
        }
    }
</script>

<style scoped>

</style>