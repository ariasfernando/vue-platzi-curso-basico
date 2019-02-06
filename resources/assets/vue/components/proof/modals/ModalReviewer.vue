<template id="modal">
    <transition name="modal">
        <div id="review-modal-url" class="modal-mask modal-proof">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <slot name="header">
                            <button type="button" class="close" @click="close"><span>&times;</span></button>
                            <h3>Notice</h3>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                        </slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="footer">
                            <!-- Input submit -->
                            <div class="modal-mpf-submit">
                                <button type="button" class="btn beta-btn-secondary" @click="close">Cancel</button>
                                <button type="button" class="btn beta-btn-primary" @click="onSubmit">Accept</button>
                            </div>
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
        methods: {
            close() {
                this.$emit('close');
            },
            onSubmit() {
                this.$emit('submit');
            },
        }
    };
</script>
<style lang="less">
    #review-modal-url {
        .modal-container {
            margin: 0 auto;
        }
        .modal-body{
            padding: 0px 20px 20px 20px;
        }
    }
</style>