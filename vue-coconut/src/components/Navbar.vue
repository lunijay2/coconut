<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <div class="container">
            <a class="navbar-brand" href="/">SM PAY</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarsExampleDefault">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a class="nav-link">모바일 결제 </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link">마이 페이지 </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link">상점 </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link">상품 등록 </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link">로그인 </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link">회원가입</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">로그아웃</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link">인증서 발급 </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
    export default {
        name: "Navbar"
    }
</script>

<style scoped>

</style>