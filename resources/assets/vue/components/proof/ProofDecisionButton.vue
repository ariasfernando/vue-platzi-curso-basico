<template>
    <button class="btn btn-default beta-btn-secondary"
        :class="buttonClasses"
        :disabled="loadingDecision.length > 0"
        v-if="selectedDecision.length === 0 || selectedDecision === decision"
        :title="selectedDecision.indexOf('-with-comments') + ' ' + selectedDecision"
        @click="submitDecision()"
        @mouseover="undo = (selectedDecision === decision)"
        @mouseleave="undo = false">
            <i :class="['glyphicon glyphicon-' + icon, {hidden: undo}]"></i>
            {{ formatedTitle }}
            <i class="glyphicon glyphicon-remove remove-decision pull-right" :class="{hidden: !undo}"></i>
    </button>
</template>

<script>
    module.exports = {
        name: 'proofDecisionButton',
        props: ['decision', 'icon', 'selectedDecision', 'loadingDecision', 'title'],
        data () {
            return {
                undo: false
            }
        },
        computed: {
            buttonClasses () {
                return {
                    'ajax-loader-small': this.loadingDecision === this.decision,
                    'approved': this.selectedDecision === 'approve' || this.selectedDecision === 'approve-with-comments',
                    'rejected': this.selectedDecision === 'reject' || this.selectedDecision === 'reject-with-comments',
                    'with-comment': this.selectedDecision.indexOf('-with-comments') > -1
                }
            },
            formatedTitle () {
                if (this.undo === true) {
                    return 'Undo decision';
                }
                else if (this.selectedDecision === this.decision) {
                    return this.title.replace('Approve', 'Approved').replace('Reject', 'Rejected');
                }
                return this.title;
            }
        },
        methods: {
            submitDecision () {
                if (this.undo === true) {
                    this.$emit('undo-decision');
                } else {
                    this.$emit('submit-decision', this.decision);
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .approved {
        background: #daeadd;
        border: none;
        color: green;
    }
    .rejected {
        background: #fcded9;
        border: none;
        color: red;
        width: 130px;
    }
    .remove-decision {
        padding-left: 10px;
    }
    .with-comment {
        width: 190px;
    }
</style>
