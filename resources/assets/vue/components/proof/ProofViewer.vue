<template id="proof-viewer">
  <div class="proof-viewer-container">
    <st-style prefix="#emailCanvas" :content="proprietaryCss" />
    <div v-sticky="{ zIndex: 999, stickyTop: 0 }" class="proof-top-bar">
      <div class="col-md-offset-3 col-md-2 col-xs-2">
        <div class="switch">
          <input
            id="desktop"
            type="radio"
            class="switch-input"
            name="view"
            value="desktop"
            checked>
          <label
            for="desktop"
            class="switch-label switch-label-off campaign-switch-view"
            @click="changeBuildingMode('desktop')">
            <i class="fa fa-desktop" />
          </label>
          <input
            id="mobile"
            type="radio"
            class="switch-input"
            name="view"
            value="mobile">
          <label
            for="mobile"
            class="switch-label switch-label-on campaign-switch-view"
            @click="changeBuildingMode('mobile')">
            <i class="glyphicon glyphicon-phone" />
          </label>
          <span class="switch-selection" />
        </div>
      </div>
      <div id="section-canvas-buttons-col" class="col-md-7 col-xs-10 text-right">
        <proof-decision
          v-if="showDecision ? true : false"
          :decision="reviewer && reviewer.decision ? reviewer.decision : ''"
          :token="token"
          @decision="decisionMade()" />
        <a
          v-if="canEdit"
          :href="$_app.config.baseUrl + '/campaign/edit/' + campaign._id"
          class="btn btn-default beta-btn-primary">
          <i class="glyphicon glyphicon-pencil" /> Edit campaign
        </a>
      </div>
    </div>
    <div class="section-container-campaign">
      <section class="section-canvas-email section-box">
        <div class="section-box-content section-canvas-container scrolled">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr v-if="campaign.length === 0">
              <td align="center">loading...</td>
            </tr>
            <tr>
              <td align="center" bgcolor="#FFFFFF" style="vertical-align:top;">
                <table
                  id="emailCanvas"
                  border="0"
                  class="stx-email-canvas wrapper-table"
                  :class="'stx-' + buildingMode + '-mode'"
                  cellspacing="0"
                  cellpadding="0"
                  :width="templateWidth">
                  <tbody v-html="campaignHtml" />
                </table>
              </td>
            </tr>
          </table>
        </div>
      </section>
      <aside>
        <proof-comments
          ref="proofComments"
          :token="token"
          :campaign-finished="campaignFinished" />
      </aside>
    </div>
    <modal-reviewer v-if="displayModal" @close="displayModal = false" @submit="goToLink">
      <div slot="body">
        <div>{{ disclaimer }}<br><br></div>
        <div>
          <p>link: <b>{{ linkUrl }}</b></p>
        </div>
      </div>
    </modal-reviewer>
  </div>
</template>

<script>
import VueSticky from 'vue-sticky';
import ModalReviewer from './modals/ModalReviewer.vue';
import ProofComments from './ProofComments.vue';
import ProofDecision from './ProofDecision.vue';
import proofService from '../../services/proof';
import StStyle from '../common/StStyle.vue';

export default {
  name: 'ProofViewer',
  components: {
    ProofComments,
    ProofDecision,
    ModalReviewer,
    StStyle,
  },
  directives: {
    sticky: VueSticky,
  },
  props: {
    token: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      buildingMode: 'desktop',
      campaign: {},
      campaignFinished: false,
      canEdit: false,
      desktopWidth: '600',
      displayModal: false,
      linkUrl: '',
      mobileWidth: '300',
      reviewer: [],
      showDecision: false,
      disclaimer:
        'The link that you are following may not render as expected in this test environment. Do you wish to proceed?',
    };
  },
  computed: {
    campaignHtml() {
      if ('body_html' in this.campaign) {
        // hide hack in Finished Emails.
        setTimeout(() => {
          $('.st-hide-hack').hide();
        }, 1000);

        // Yes, it's ugly, but this width value is set in the body_html and we need
        // to remove it so the switch can work.
        // @TODO: check why this value is in the body_html
        return this.campaign.body_html.replace(`width="${this.desktopWidth}"`, '');
      }
      return '';
    },
    templateWidth() {
      if (this.buildingMode === 'desktop') {
        return this.desktopWidth;
      }
      return this.mobileWidth;
    },
    proprietaryCss() {
      return this.campaign.propietaryCss;
    },
  },
  created() {
    // Get campaign data
    this.getProofData();
  },
  mounted() {
    this.urlPrevent();
  },
  methods: {
    getProofData() {
      proofService.getData(this.token).then((response) => {
        if (response.status === 'success') {
          this.campaign = response.data.campaign;
          this.reviewer = response.data.reviewer;
          this.showDecision = response.data.show_decision;
          this.canEdit = response.data.can_edit;
          this.campaignFinished = response.data.campaign_finished;
          this.desktopWidth = response.data.campaign.template_width;
          this.mobileWidth = response.data.campaign.template_mobile_width;
          if ('message' in response.data) {
            this.$root.$toast(response.data.message, {
              className: 'et-success',
            });
          }
        }
      });
    },
    decisionMade() {
      // Ugly but works. @TODO: find a better way to do this (e.g. vuex)
      this.$refs.proofComments.getComments();
    },
    changeBuildingMode(mode) {
      this.buildingMode = mode;
    },
    goToLink() {
      this.displayModal = false;
      window.open(this.linkUrl, '_blank');
    },
    urlPrevent() {
      $('#emailCanvas').on('click', 'a', (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.showLinkModal = true;
        this.linkUrl = $(e.target).closest('a').attr('href');
        this.displayModal = true;
      });
    },
  },
};
</script>

<style lang="less">
.proof-viewer-container {
  width: 100%;
  display: table;
  min-height: 100%;

  .section-canvas-email {
    width: 100%;
    position: relative;

    .scrolled {
      width: 100%;
      max-height: 80vh;
      overflow-y: scroll;
    }
    .scrolled::-webkit-scrollbar {
      width: .4em;
    }
    .scrolled::-webkit-scrollbar,
    .scrolled::-webkit-scrollbar-thumb {
      overflow: visible;
      border-radius: 4px;
    }
    .scrolled::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,.2);
    }
    .cover-bar {
      position: absolute;
      background: #fff;
      height: 100%;
      top: 0;
      right: 0;
      width: .4em;
      -webkit-transition: all .5s;
      opacity: 1;
    }
    .section-canvas-email:hover .cover-bar {
      opacity: 0;
      -webkit-transition: all .5s;
    }
  }
}
#emailCanvas {
  &:empty {
    min-height: 40px;
  }
  &.stx-mobile-mode {
    width: 480px;
    // Mobile Classes
    @import '../../../less/base/commons/mobile/mobile_core_styles';
  }
}
</style>
