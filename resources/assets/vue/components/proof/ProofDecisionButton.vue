<template>
    <button class="btn btn-default beta-btn-secondary"
        :class="buttonClasses"
        :disabled="loadingDecision.length > 0"
        v-if="selectedDecision.length === 0 || selectedDecision === decision"
        @click="submitDecision()"
        @mouseover="undo = (selectedDecision === decision)"
        @mouseleave="undo = false">
            <i :class="['glyphicon glyphicon-' + icon, {hidden: undo}]"></i>
            {{ formatedTitle }}
            <i class="glyphicon glyphicon-remove remove-decision" :class="{hidden: !undo}"></i>
    </button>
</template>

<script>
    module.exports = {
        name: 'proofDecisionButton',
        props: ['decision', 'icon', 'selectedDecision', 'loadingDecision', 'title'],
        data: function() {
            return {
                undo: false
            }
        },
        computed: {
            buttonClasses: function() {
                return {
                    'ajax-loader-small': this.loadingDecision === this.decision,
                    'approved': this.selectedDecision === 'approve' || this.selectedDecision === 'approve-with-comments',
                    'rejected': this.selectedDecision === 'reject' || this.selectedDecision === 'reject-with-comments'
                }
            },
            formatedTitle: function() {
                if (this.undo === true) {
                    return 'Undo decision';
                }
                else if (this.selectedDecision === this.decision) {
                    return this.title.replace('Approve', 'Approved').replace('Reject', 'Rejected');
                }
                return this.title;
            },
        },
        methods: {
            submitDecision: function() {
                if (this.undo === true) {
                    this.$emit('undo-decision');
                } else {
                    this.$emit('submit-decision', this.decision);
                }
            }
        }
    }
</script>

<style lang="scss">
    .approved {
        background: #daeadd;
        border: none;
        color: green;
    }
    .rejected {
        background: #fcded9;
        border: none;
        color: red;
    }
    .remove-decision {
        padding-left: 10px;
    }
</style>
