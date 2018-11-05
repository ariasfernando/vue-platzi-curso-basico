<template id="proof-decision">
    <div class="decision-container">

        <proof-decision-button
            decision="approve"
            icon="ok"
            title="Approve"
            :loading-decision="loadingDecision"
            :selected-decision="selectedDecision"
            @submit-decision="submitDecision"
            @undo-decision="undoDecision"
        ></proof-decision-button>

        <proof-decision-button
            decision="approve-with-comments"
            icon="ok"
            title="Approve with comments"
            :loading-decision="loadingDecision"
            :selected-decision="selectedDecision"
            @submit-decision="askComment"
            @undo-decision="undoDecision"
        ></proof-decision-button>

        <proof-decision-button
            decision="reject"
            icon="remove"
            title="Reject"
            :loading-decision="loadingDecision"
            :selected-decision="selectedDecision"
            @submit-decision="submitDecision"
            @undo-decision="undoDecision"
        ></proof-decision-button>

        <proof-decision-button
            decision="reject-with-comments"
            icon="remove"
            title="Reject with comments"
            :loading-decision="loadingDecision"
            :selected-decision="selectedDecision"
            @submit-decision="askComment"
            @undo-decision="undoDecision"
        ></proof-decision-button>

        <modal v-if="showCommentModal" @close="closeCommentModal" @accept="confirmCommentModal">
            <div slot="body">
                <p>Insert your comment here:</p>
                <textarea class="form-control" v-model="comment"></textarea>
            </div>
        </modal>

        <modal v-if="showUndoDecisionModal" @close="closeUndoDecisionModal" @accept="confirmUndoDecisionModal">
            <div slot="body">
                <p v-if="selectedDecision === 'approve' || selectedDecision === 'approve-with-comments'">
                    You already approved this campaign. Are you sure you want to undo this action?</p>
                <p v-if="selectedDecision === 'reject' || selectedDecision === 'reject-with-comments'">
                    You already rejected this campaign. Are you sure you want to undo this action?</p>
            </div>
        </modal>

    </div>
</template>

<script>
    import Modal from '../common/Modal.vue';
    import ProofDecisionButton from './ProofDecisionButton.vue';
    import proofService from '../../services/proof';

    module.exports = {
        name: 'proofDecision',
        components: {
            Modal,
            ProofDecisionButton
        },
        data: function() {
            return {
                showCommentModal: false,
                loadingDecision: '',
                selectedDecision: '',
                comment: '',
                showUndoDecisionModal: false
            }
        },
        props: ['decision', 'token'],
        created: function() {
            // Load the current decision
            this.selectedDecision = this.decision;
        },
        methods: {
            submitDecision: function(decision) {
                var vm = this;

                if (vm.selectedDecision.length > 0) {
                    // A decision has already been taken
                    return false;
                }
                vm.loadingDecision = decision;

                const data = {
                    decision: decision,
                    comment: vm.comment
                };

                proofService.postDecision(vm.token, data).then((response) => {
                    if (response.status === 'success') {
                        vm.selectedDecision = decision;
                        // Show an alert
                        vm.$root.$toast(response.message || 'Thank you! Your feedback has been successfully collected.', {className: 'et-success'});
                        vm.$emit('decision');
                    } else {
                        // Show an alert
                        vm.$root.$toast(response.message, {className: 'et-error'});
                    }
                    vm.loadingDecision = '';
                });
            },
            askComment: function(decision) {
                if (this.selectedDecision.length > 0) {
                    // A decision has already been taken
                    return false;
                }
                this.loadingDecision = decision;
                this.showCommentModal = true;
            },
            confirmCommentModal: function() {
                this.submitDecision(this.loadingDecision);
                this.showCommentModal = false;
            },
            closeCommentModal: function() {
                this.showCommentModal = false;
                this.loadingDecision = '';
            },
            undoDecision: function() {
                this.showUndoDecisionModal = true;
                this.comment = '';
            },
            closeUndoDecisionModal: function() {
                this.showUndoDecisionModal = false
            },
            confirmUndoDecisionModal: function() {
                var _this = this;
                proofService.deleteDecision(_this.token).then((response) => {
                    _this.closeUndoDecisionModal();
                    if (response.status === 'success') {
                        _this.selectedDecision = '';
                        // Show an alert
                        _this.$root.$toast(response.body.message || 'Your decision has been undone.', {className: 'et-success'});
                        _this.$emit('decision');
                    } else {
                        // Show an alert
                        _this.$root.$toast(response.body.message, {className: 'et-error'});
                    }
                    _this.loadingDecision = '';
                });
            }
        }
    };
</script>

<style lang="less">
    .decision-container {
        display: inline-block;
    }
</style>
