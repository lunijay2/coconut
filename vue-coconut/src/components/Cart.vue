<template>
    <from>
        <div class="row" v-if="choice == 'cart'">
            <h1>dsdsd</h1>
        </div>
    </from>
</template>

<script>
    export default {
        name: "Cart",

        data() {
            return {
                user : {}

            }
        },

        props: {
            choice : ''
        },

        created() {
            this.$store.dispatch('GetProfile')
                .then( response => {
                    console.log('토큰검증 성공');
                    this.user = response.data.user;});

        },

        watch : {
            choice : function (category) {
                if ( category == 'cart') {
                    console.log('왔다 : '+category);
                    console.log(JSON.stringify(this.user));
                    this.$store.dispatch('GetCart')

                }
                else {
                    console.log('안왔다: ');
                }

            }
        }

    }
</script>

<style scoped>

</style>