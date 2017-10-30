<template id="modal">
    <transition name="modal">
        <div id="modal-mask">
            <div class="modal-dialog" v-bind:class="'modal-' + size">
                <div class="modal-content">
                    <div class="modal-body text-center">
                        <slot name="body">
                            default body
                        </slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="footer">
                            <button type="button" class="btn btn-default beta-btn-primary" v-on:click.stop.prevent="$emit('accept')">Accept</button>
                            <button type="button" class="btn btn-primary beta-btn-secondary" v-on:click.stop.prevent="$emit('close')">Cancel</button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    module.exports = {
        name: 'modal',
        props: {
            size: {
                type: String,
                default: 'sm'
            }
        }
    };
</script>

<style lang="less">

</style>
