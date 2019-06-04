<template>
    <div class="list-group">
        <a class="list-group-item list-group-item-action flex-column align-items-start">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{choice}} List group item heading</h5>
                <small class="text-muted">3 days ago</small>
            </div>
            <p class="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
            <small class="text-muted">Donec id elit non mi porta.</small>
        </a>
    </div>
</template>

<script>
    export default {
        name: "Category",
        props: {
            choice : ''
        },
        data () {
            return {
                Choice : this.choice
            } 
        },
        methods : {
            GetCategory : function () {
                this.$store.dispatch('FindCategory', this.choice)
                    .then( response => {
                        alert('카테고리 결과 1 : '+JSON.stringify(response));
                        console.log('카테고리 성공 1');
                    })
                    .catch( err => {
                        console.log('카테고리 실패 1 : ' + err);
                        alert(err);
                    })
            }
        },
        created() {
            this.$store.dispatch('GetProduct')
                .then( response => {
                    alert('카테고리 결과 2 : '+JSON.stringify(response));
                    console.log('카테고리 성공 2');
                })
                .catch( err => {
                    console.log('카테고리 실패 2 : ' + err);
                    alert(err);
                })
        },
        watch : {

        }
    }
</script>

<style scoped>

</style>