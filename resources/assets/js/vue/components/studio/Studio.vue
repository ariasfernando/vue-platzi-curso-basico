<template>

    <div class="row">
        <div class="col-sm-6 text-center">
            <h3><router-link to="/libraries">Libraries</router-link></h3>
        </div>

        <div class="col-sm-6 text-center">
            <h3><router-link to="/modules">Modules</router-link></h3>
        </div>
    </div>

</template>

<script>
    export default {
        created() {
            console.log(this.$route)
        }
    }
</script>