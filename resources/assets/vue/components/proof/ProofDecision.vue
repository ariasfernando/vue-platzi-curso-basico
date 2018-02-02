<template id="proof-decision">
    <div>

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
                <p v-if="this.selectedDecision === 'approve' || this.selectedDecision === 'approve-with-comments'">
                    You already approved this campaign. Are you sure you want to undo this action?</p>
                <p v-if="this.selectedDecision === 'reject' || this.selectedDecision === 'reject-with-comments'">
                    You already rejected this campaign. Are you sure you want to undo this action?</p>
            </div>
        </modal>

    </div>
</template>

<script>
    import Modal from '../common/Modal.vue';
    import ProofDecisionButton from './ProofDecisionButton.vue';

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
            // TODO: find a way to define this in the vue instance
            Vue.http.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            // Load the current decision
            this.selectedDecision = this.decision;
        },
        methods: {
            getComments: function() {
                var vm = this;
                Vue.http.get(Application.globals.baseUrl + '/proof/comments/' + vm.token)
                    .then(function( resp ) {
                        if (resp.status == 200) {
                            vm.comments = resp.body;
                        }
                    });
            },
            submitDecision: function(decision) {
                var vm = this;

                if (vm.selectedDecision.length > 0) {
                    // A decision has already been taken
                    return false;
                }
                vm.loadingDecision = decision;

                Vue.http.post(Application.globals.baseUrl + '/proof/decision/' + vm.token, {
                    decision: decision,
                    comment: vm.comment
                })
                    .then(function( resp ) {
                        if (resp.status == 200) {
                            vm.selectedDecision = decision;
                            // Show an alert
                            vm.$root.$toast(resp.message || 'Thank you! Your feedback has been successfully collected.', {className: 'et-success'});
                            vm.$emit('decision');
                        } else {
                            // Show an alert
                            vm.$root.$toast(resp.message, {className: 'et-error'});
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
            },
            closeUndoDecisionModal: function() {
                this.showUndoDecisionModal = false
            },
            confirmUndoDecisionModal: function() {
                var vm = this;
                Vue.http.delete(Application.globals.baseUrl + '/proof/decision/' + vm.token)
                    .then(function( resp ) {
                        vm.closeUndoDecisionModal();
                        if (resp.status == 200) {
                            vm.selectedDecision = '';
                            // Show an alert
                            vm.$root.$toast(resp.body.message || 'Your decision has been undone.', {className: 'et-success'});
                            vm.$emit('decision');
                        } else {
                            // Show an alert
                            vm.$root.$toast(resp.body.message, {className: 'et-error'});
                        }
                        vm.loadingDecision = '';
                    });
            }
        }
    };
</script>

<style lang="sass">

</style>
