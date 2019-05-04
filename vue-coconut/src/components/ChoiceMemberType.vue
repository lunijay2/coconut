<template>
    <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-3">
            <div class="card mb-3" style="max-width: 30rem;">
                <div class="card-header text-white bg-danger"><strong>개인 회원 가입</strong></div>
                <div class="list-group">
                    <a class="list-group-item list-group-item-action flex-column align-items-start">
                        <div class="float-left">
                            <h5 class="card-text">개인 구매회원</h5>
                            <h6 class="card-subtitle text-muted">만 14세 이상</h6>
                        </div>
                        <router-link to="/RegisterIndivisual" class="nav-link">
                            <button type="submit" class="btn btn-danger float-right">회원가입</button>
                        </router-link>
                    </a>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card mb-3" style="max-width: 40rem;">
                <div class="card-header text-white bg-info"><strong>사업자 회원 가입</strong></div>
                <div class="list-group">
                    <a class="list-group-item list-group-item-action flex-column align-items-start">
                        <div class="float-left">
                            <h5 class="card-text">사업자 구매회원</h5>
                        </div>
                        <router-link to="/RegisterEnterpriseBuyer" class="nav-link">
                            <button type="submit" class="btn btn-info float-right">회원가입</button>
                        </router-link>
                    </a>
                    <a class="list-group-item list-group-item-action flex-column align-items-start">
                        <div class="float-left">
                            <h5 class="card-text">사업자 판매회원</h5>
                        </div>
                        <router-link to="/RegisterEnterpriseSeller" class="nav-link">
                            <button type="submit" class="btn btn-info float-right">회원가입</button>
                        </router-link>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ChoiceMemberType"
    }
</script>

<style scoped>

</style>