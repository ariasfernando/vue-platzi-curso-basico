<template id="proof-viewer">
    <div class="proof-viewer-container">
        <div class="proof-top-bar" v-sticky="{ zIndex: 999, stickyTop: 0 }">
            <div class="col-md-offset-3 col-md-2 col-xs-2">
                <div class="switch">
                    <input type="radio" class="switch-input" name="view" value="desktop" id="desktop" checked>
                    <label for="desktop" class="switch-label switch-label-off campaign-switch-view" @click="changeBuildingMode('desktop')">
                        <i class="fa fa-desktop"></i>
                    </label>
                    <input type="radio" class="switch-input" name="view" value="mobile" id="mobile">
                    <label for="mobile" class="switch-label switch-label-on campaign-switch-view" @click="changeBuildingMode('mobile')">
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
                    v-on:decision="decisionMade()"
                ></proof-decision>
                <a
                    :href="$_app.config.baseUrl + '/campaign/edit/' + campaign._id"
                    class="btn btn-default beta-btn-primary"
                    v-if="canEdit"
                ><i class="glyphicon glyphicon-pencil"></i> Edit campaign</a>
            </div>
        </div>

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
                                    :class="'stx-' + buildingMode + '-mode'"
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
                ></proof-comments>
            </aside>
        </div>
        <modal-reviewer v-if="displayModal" @close="displayModal = false" @submit="goToLink">
          <div slot="body">
            <div>
              The link that you are following may not render as expected in this test environment. Do you wish to proceed?
              <br>
              <br>
            </div>
            <div>
              <p>link: <b>{{linkUrl}}</b></p>
            </div>
          </div>
        </modal-reviewer>
    </div>
</template>

<script>
  import ProofComments from './ProofComments.vue';
  import ProofDecision from './ProofDecision.vue';
  import VueSticky from 'vue-sticky';
  import proofService from '../../services/proof';
  import ModalReviewer from './modals/ModalReviewer.vue';

  export default {
    name: 'proofViewer',
    components: {
      ProofComments,
      ProofDecision,
      ModalReviewer
    },
    data() {
      return {
        campaign: {},
        showDecision: false,
        canEdit: false,
        reviewer: [],
        desktopWidth: '600',
        mobileWidth: '300',
        buildingMode: 'desktop',
        displayModal: false,
        linkUrl: '',
      };
    },
    props: ['token'],
    computed: {
      campaignHtml () {
        if ('body_html' in this.campaign) {
          // Yes, it's ugly, but this width value is set in the body_html and we need
          // to remove it so the switch can work.
          // @TODO: check why this value is in the body_html
          return this.campaign.body_html.replace('width="' + this.desktopWidth + '"', '');
        } else {
          return '';
        }
      },
      templateWidth () {
        if (this.buildingMode === 'desktop') {
          return this.desktopWidth;
        } else {
          return this.mobileWidth;
        }
      }
    },
    created: function() {
      // Get campaign data
      this.getProofData();
    },
    mounted: function () {
      this.urlPrevent();
    },
    directives: {
      'sticky': VueSticky,
    },
    methods: {
      getProofData: function() {
        var _this = this;
        proofService.getData(_this.token).then((response) => {
          if (response.status === 'success') {
            _this.campaign = response.data.campaign;
            _this.reviewer = response.data.reviewer;
            _this.showDecision = response.data.show_decision;
            _this.canEdit = response.data.can_edit;
            _this.desktopWidth = response.data.campaign.template_width;
            _this.mobileWidth = response.data.campaign.template_mobile_width;
            if ('message' in response.data) {
              _this.$root.$toast(response.data.message, {className: 'et-success'});
            }
          }
        });
      },
      decisionMade: function() {
        return false; // this will be commented until we finish all this implementation
        // Ugly but works. @TODO: find a better way to do this (e.g. vuex)
        this.$children[1].getComments();
      },
      changeBuildingMode(mode) {
        this.buildingMode = mode;
      },
      goToLink(){
        this.displayModal = false;
        window.open(this.linkUrl,'_blank');
      },
      urlPrevent() {
        $("#emailCanvas").on('click','a', (e) => {
          e.stopPropagation();
          e.preventDefault();
          this.showLinkModal= true;
          this.linkUrl = $(e.target).closest('a').attr('href');
          this.displayModal = true;
        });
      }
    }
  };
</script>

<style lang="less">
    .proof-viewer-container {
        width: 100%;
        display: table;
        min-height: 100%;
    }
    #emailCanvas{
        &:empty {
          min-height: 40px;
        }
        &.stx-mobile-mode {
          width: 480px;
          // Mobile Classes
          @import '../../../less/base/commons/mobile/mobile_core_styles';
          @import '../../../less/base/commons/mobile/mobile_client_styles';
        }
    }
</style>
