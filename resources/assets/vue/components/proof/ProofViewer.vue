<template id="proof-viewer">
    <div class="proof-viewer-container">
        <div class="proof-top-bar" v-sticky="{ zIndex: 999, stickyTop: 0 }">
            <div class="col-md-offset-3 col-md-2 col-xs-2">
                <div class="switch">
                    <input type="radio" class="switch-input" name="view" value="desktop" id="desktop" checked>
                    <label for="desktop" class="switch-label switch-label-off campaign-switch-view" @click="mode = 'desktop'">
                        <i class="fa fa-desktop"></i>
                    </label>
                    <input type="radio" class="switch-input" name="view" value="mobile" id="mobile">
                    <label for="mobile" class="switch-label switch-label-on campaign-switch-view" @click="mode = 'mobile'">
                        <i class="glyphicon glyphicon-phone"></i>
                    </label>
                    <span class="switch-selection"></span>
                  </div>
             </div>
             <div class="col-md-7 col-xs-10 text-right" id="section-canvas-buttons-col">
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
                                <table
                                    border="0"
                                    class="stx-email-canvas wrapper-table"
                                    id="emailCanvas"
                                    cellspacing="0"
                                    cellpadding="0"
                                    :width="templateWidth">
                                    <tbody v-html="campaignHtml"></tbody>
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
    import VueSticky from 'vue-sticky';

    export default {
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
                reviewer: [],
                mode: 'desktop'
            };
        },
        props: ['token'],
        computed: {
            campaignHtml () {
                if ('body_html' in this.campaign) {
                    // Yes, it's ugly, but this width value is set in the body_html and we need
                    // to remove it so the switch can work.
                    // @TODO: check why this value is in the body_html
                    return this.campaign.body_html.replace('660', '');
                } else {
                    return '';
                }
            },
            templateWidth () {
                return this.mode === 'desktop' ? 600 : 440;
            }
        },
        created: function() {
            // TODO: find a way to define this in the vue instance
            Vue.http.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            // Get campaign data
            this.getProofData();
        },
        directives: {
          'sticky': VueSticky,
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
        display: table;
        min-height: 100%;
    }
</style>
