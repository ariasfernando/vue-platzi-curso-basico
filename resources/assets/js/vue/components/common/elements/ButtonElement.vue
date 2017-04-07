<template id="button-element">
    <!-- CALL TO ACTION ELEMENT -->
    <table width="150" border="0" class="st-cta" cellpadding="0" cellspacing="0">
        <tr>
            <td width="100%" align="center" height="20" :style="component.style">
                <a :href="component.destinationUrl" target="" class="st-without-event">
                    <span contenteditable="true" @keyup="changed" @blur="changed" @paste="changed" v-html="component.text"></span>
                </a>
            </td>
        </tr>
    </table>
    <!-- CALL TO ACTION ELEMENT ENDS -->
</template>

<script>
    export default {
        name: 'ButtonElement',
        props: [
            'module-id',
            'column-id',
            'component-id',
            'component'
        ],
        timeoutID: null,
        methods: {
            changed (event) {
                let _this = this;
                clearTimeout(this.$timeoutID);

                this.$timeoutID = setTimeout( function() {
                    let text = event.target.innerHTML.trim();
                    let key = $(event.target).data('key');

                    let edited = {};
                    edited[key] = text;

                    this.$store.commit('updateElement', {
                        moduleId: _this.moduleId,
                        columnId: _this.columnId,
                        componentId: _this.componentId,
                        data: edited
                    });
                }, 500);
            }
        }
    };
</script>