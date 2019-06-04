<template>
    <div class="AllProduct">
    <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-2">
            <table class="table table-hover">
                <tbody>
                <tr class="table-success">
                    <th scope="row" v-on:click="onCategory('all')">
                        모든 상품
                    </th>
                </tr>
                <tr class="table-success">
                    <th scope="row" v-on:click="onCategory('의류')">의류</th>
                </tr>
                <tr class="table-success">
                    <th scope="row" v-on:click="onCategory('식품')">식품</th>
                </tr>
                <tr class="table-success">
                    <th scope="row" v-on:click="onCategory('생활용품')">생활용품</th>
                </tr>
                <tr class="table-success">
                    <th scope="row" v-on:click="onCategory('가전디지털')">가전/디지털</th>
                </tr>
                <tr class="table-success">
                    <th scope="row" v-on:click="onCategory('스포츠/레저')">스포츠/레저</th>
                </tr>
                <tr class="table-success">
                    <th scope="row" v-on:click="onCategory('자동차용품')">자동차 용품</th>
                </tr>
                <tr class="table-success">
                    <th scope="row" v-on:click="onCategory('도서/음반/DVD')">도서/음반/DVD</th>
                </tr>
                <tr class="table-success">
                    <th scope="row" v-on:click="onCategory('완구/취미')">완구/취미</th>
                </tr>
                <tr class="table-success">
                    <th scope="row" v-on:click="onCategory('문구/오피스')">문구/오피스</th>
                </tr>
                <tr class="table-success">
                    <th scope="row" v-on:click="onCategory('반려동물용품')">반려동물용품</th>
                </tr>
                <tr class="table-success">
                    <th scope="row" v-on:click="onCategory('뷰티')">뷰티</th>
                </tr>
                <tr class="table-success">
                    <th scope="row" v-on:click="onCategory('출산/유아동')">출산/유아동</th>
                </tr>
                <tr class="table-success">
                    <th scope="row" v-on:click="onCategory('주방용품')">주방용품</th>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="col-md-1"></div>
        <div class="col-md-6">
            <Category v-bind:choice="choiceCategory"></Category>
        </div>
    </div>
    </div>
</template>

<script>
    import Category from "./Category";

    export default {
        name: "AllProduct",
        components : {
            Category
        },
        data () {
            return {
                choiceCategory : ''
            }
        },
        methods : {
            onCategory : function ( select ) {
                this.choiceCategory = select;
                console.log(this.choiceCategory);
            }
        }
    }
</script>

<style scoped>

</style>