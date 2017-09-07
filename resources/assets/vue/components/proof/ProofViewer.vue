<template id="proof-viewer">
    <div class="proof-viewer-container">

        <div class="proof-top-bar">
            <div class="col-xs-6">
                <div class="switch pull-right">
                    <input type="radio" class="switch-input" name="view" value="desktop" id="desktop" checked>
                    <label for="desktop" class="switch-label switch-label-off campaign-switch-view">
                        <i class="fa fa-desktop"></i>
                    </label>
                       <input type="radio" class="switch-input" name="view" value="mobile" id="mobile">
                       <label for="mobile" class="switch-label switch-label-on campaign-switch-view">
                        <i class="glyphicon glyphicon-phone"></i>
                    </label>
                     <span class="switch-selection"></span>
                  </div>
             </div>
             <div class="col-xs-6 text-right" id="section-canvas-buttons-col">
                 <proof-decision
                     :decision="reviewer && reviewer.decision ? reviewer.decision : ''"
                     :token="token"
                     v-if="showDecision ? true : false"
                     v-on:update-alert="updateAlert"
                    v-on:decision="decisionMade()"
                ></proof-decision>
            </div>
        </div>

        <alert
            :title="alert.title"
            :message="alert.message"
            :type="alert.type"
            :show="alert.show"
            v-on:hide-alert="alert.show = false"
        ></alert>

        <div class="section-container-campaign">
            <section class="section-canvas-email section-box">
                <div class="section-box-content section-canvas-container">
                    <table cellpadding="0" cellspacing="0" width="100%">
                        <tr v-if="campaign.length === 0">
                            <td align="center">
                                loading...
                            </td>
                        </tr>
                        <tr>
                            <td align="center" bgcolor="#FFFFFF" style="vertical-align:top;">
                                <table id="emailCanvas" class="email-canvas wrapper-table" :width="campaign.template_width" cellspacing="0" cellpadding="0" border="0">
                                    <tbody v-html="campaign.body_html"></tbody>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </section>

            <aside>
                <proof-comments
                    :token="token"
                    v-on:update-alert="updateAlert"
                ></proof-comments>
            </aside>
        </div>

    </div>
</template>

<script>
    import ProofComments from './ProofComments.vue';
    import ProofDecision from './ProofDecision.vue';
    import Alert from './Alert.vue';

    module.exports = {
        name: 'proofViewer',
        components: {
            Alert,
            ProofComments,
            ProofDecision
        },
        data() {
            return {
                alert: {
                    title: '',
                    message: '',
                    type: '',
                    show: false
                },
                campaign: [],
                showDecision: false,
                reviewer: []
            };
        },
        props: ['token'],
        created: function() {
            // TODO: find a way to define this in the vue instance
            Vue.http.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            // Get campaign data
            this.getProofData();
        },
        methods: {
            getProofData: function() {
                var vm = this;
                Vue.http.get(Application.globals.baseUrl + '/proof/data/' + vm.token)
                    .then(function( resp ) {
                        if (resp.status == 200) {
                            vm.campaign = resp.body.data.campaign;
                            vm.reviewer = resp.body.data.reviewer;
                            vm.showDecision = resp.body.data.show_decision;
                            if ('message' in resp.body.data) {
                                vm.alert = {
                                    message: resp.body.data.message,
                                    show: true
                                }
                            }
                        }
                    });
            },
            updateAlert: function(data) {
                this.alert = data;
            },
            decisionMade: function() {
                // Ugly but works. @TODO: find a better way to do this (e.g. vuex)
                this.$children[1].getComments();
            }
        }
    };
</script>

<style lang="sass">
    .proof-viewer-container {
        width: 100%;
    }
</style>
