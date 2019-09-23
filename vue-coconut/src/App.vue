<template>
    <div id="app" class="container">
        <form>
            <header>
                <Navbar></Navbar>
            </header>

            <section>
                <router-view />

            </section>
        </form>
    </div>
</template>

<script>
    import Navbar from "./components/Navbar";

    export default {
        name: "app",
        components: {
            Navbar
        },
        created() {
            this.$store.commit("GET_TOKENS");
        }
    };
</script>

<style>
    #app {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /*text-align: center;*/
        position: relative;
        width: 100%;
    }
    body{
        margin-top:120px; /*메뉴바와 본문의 간격 설정*/
    }
    @media(max-width: 840px){
        body{
            margin-top:120px;
        }
    }
</style>