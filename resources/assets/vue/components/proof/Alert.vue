<template id="alert">
    <transition name="slide-fade">
        <div :class="alertType" role="alert" v-if="show">
            <button type="button" class="close" v-on:click="$emit('hide-alert')"><span aria-hidden="true">&times;</span></button>
            <strong v-if="title.length > 0">{{ title }}</strong> {{ message }}
        </div>
    </transition>
</template>

<script>
    module.exports = {
        name: 'alert',
        props: {
            show: {
                default: false
            },
            title: {
                default: ''
            },
            message: {
                default: ''
            },
            type: {
                default: 'info'
            }
        },
        computed: {
            alertType: function() {
                return 'alert alert-' + this.type;
            }
        }
    };
</script>

<style lang="scss">

</style>
