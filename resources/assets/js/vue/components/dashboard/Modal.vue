<template>
    <transition name="modal">
        <div id="modal-mask">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <slot name="header">
                            <button type="button" class="close" v-on:click.stop.prevent="$emit('close')"><span>&times;</span></button>
                        </slot>
                    </div>
                    <div class="modal-body text-center">
                        <slot name="body">
                            default body
                        </slot>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" v-on:click.stop.prevent="$emit('accept')">Accept</button>
                        <button type="button" class="btn btn-primary" v-on:click.stop.prevent="$emit('close')">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>