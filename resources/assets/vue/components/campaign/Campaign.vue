<template>
  <div class="section-container-campaign">
    <email-actions v-if="campaignReady && campaignConfigReady"></email-actions>

    <div class="container-campaign-subwrapper">
      <div class="beta-wrapper"></div>
      <column-bar-container side="left" :style="locked ? 'overflow-y: hidden;' : undefined">
        <div>
          <div class="menu-campaign">
            <campaign-configuration v-if="campaignReady && campaignConfigReady"></campaign-configuration>
            <tracking v-if="trackingEnabled" :library-key="libraryKey"></tracking>
            <campaign-menu v-if="campaignReady && !locked" :library-id="libraryId"></campaign-menu>
            <div class="lock-warning-container" v-if="locked">Unfix the email to add modules</div>
          </div>
        </div>
      </column-bar-container>

      <!-- container email -->
      <section class="section-canvas-email module-container">
        <email-canvas v-if="campaignReady"></email-canvas>
      </section>

      <column-bar-container side="right">
        <div>
            <module-settings v-if="showModuleSettings"></module-settings>
            <component-settings v-if="Object.keys(currentComponent).length > 0 && !showModuleSettings"></component-settings>
            <custom-module-settings v-if="currentCustomModule"></custom-module-settings>
        </div>
      </column-bar-container>
    </div>

    <!-- Modals -->
    <modal-complete v-if="campaignReady"></modal-complete>
    <modal-preview v-if="campaignReady"></modal-preview>
    <modal-esp v-if="campaignReady"></modal-esp>
    <modal-proof v-if="campaignReady"></modal-proof>
    <modal-enable-templating v-if="campaignReady"></modal-enable-templating>

    <spinner></spinner>

  </div>
</template>

<script>
  import _ from 'lodash'
  import CampaignConfiguration from './CampaignConfiguration.vue'
  import CampaignMenu from './CampaignMenu.vue'
  import CampaignService from '../../services/campaign'
  import ColumnBarContainer from "../common/containers/ColumnBarContainer.vue";
  import ComponentSettings from './ComponentSettings.vue'
  import CustomModuleSettings from './CustomModuleSettings.vue'
  import EmailActions from './EmailActions.vue'
  import EmailCanvas from './EmailCanvas.vue'
  import ModalComplete from './modals/ModalComplete.vue'
  import ModalEnableTemplating from './modals/ModalEnableTemplating.vue'
  import ModalEsp from './modals/ModalEsp.vue'
  import ModalPreview from './modals/ModalPreview.vue'
  import ModalProof from './modals/ModalProof.vue'
  import ModuleSettings from './ModuleSettings.vue'
  import Spinner from '../common/Spinner.vue'
  import Tracking from './Tracking.vue'
  import VueSticky from 'vue-sticky'

  export default {
    name: 'Campaign',
    props: ['campaignId', 'libraryId', 'windowId', 'cachedWindowId'],
    components: {
      CampaignConfiguration,
      CampaignMenu,
      ColumnBarContainer,
      ComponentSettings,
      CustomModuleSettings,
      EmailActions,
      EmailCanvas,
      ModalComplete,
      ModalEnableTemplating,
      ModalEsp,
      ModalPreview,
      ModalProof,
      ModuleSettings,
      Spinner,
      Tracking,
    },
    data: function () {
      return {
        campaignReady: false,
        campaignConfigReady: false,
        pingLockInterval: 30000,
        logTimeInterval: 30000,
        campaignConfig: {},
        trackingEnabled: false,
      }
    },
    computed: {
      campaign() {
        return this.$store.getters["campaign/campaign"];
      },
      libraryKey() {
        return this.$store.getters["campaign/campaign"].library_config.key;
      },
      locked() {
        return this.campaign.campaign_data && this.campaign.campaign_data.locked;
      },
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      },
      currentCustomModule() {
        return !_.isUndefined(this.$store.getters["campaign/currentCustomModule"]);
      },
      dirty() {
        return this.$store.getters["campaign/dirty"];
      },
      showModuleSettings() {
        return this.$store.getters["campaign/showModuleSettings"];
      },
      sessionWindowId() {
        try {
          if (!window.sessionStorage.getItem('windowId')) {
            window.sessionStorage.setItem('windowId', this.windowId);
          }
          return window.sessionStorage.getItem('windowId');
        } catch(e) {
          return false;
        }
      }
    },
    watch:{
      dirty(value) {
        if (value === true) {
          $(window).bind('beforeunload', () => {
            return "If you leave this page, you will lose any unsaved changes.";
          });
        } else {
          $(window).unbind('beforeunload');
        }
      },
    },
    directives: {
      'sticky': VueSticky,
    },
    methods: {
      loadCampaign() {

        /*
         * Replace url when creating a new campaign to avoid redirect.
         * Add necessary logic if using more parameters in the future.
         */
        try {
          window.history.replaceState({}, null, '/campaign/edit/' + this.campaignId);
        } catch(e) {
          return false;
        }

        this.$store.dispatch("campaign/getCampaignData", this.campaignId).then(response => {
          this.$store.commit("global/setLoader", false);
          this.campaignReady = true;
          this.trackingEnabled = (this.campaignReady && this.campaignConfig && this.campaignConfig.enable_tracking && _.has(this.campaign.library_config, 'tracking') && this.campaign.library_config.tracking);
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast(
            'Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.',
            {className: 'et-error'}
          );
        });
      },
      loadConfig() {
        this.$store.dispatch("config/getConfig", 'campaign').then(response => {
          this.campaignConfigReady = true;        
          this.campaignConfig = this.$store.getters["config/config"].campaign;
        }, error => {
          this.$root.$toast(
            'Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.',
            {className: 'et-error'}
          );
        });
      },
      lockPing() {
        this.$store.dispatch('campaign/pingLockCampaign',
          {campaignId: this.campaignId, windowId: this.sessionWindowId});
        setInterval(() => {
          this.$store.dispatch('campaign/pingLockCampaign',
            {campaignId: this.campaignId, windowId: this.sessionWindowId}).then(response => {
          }, error => {
            this.$root.$toast(
              'Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.',
              {className: 'et-error'}
            );
          });

        }, this.pingLockInterval);
      }
    },
    created: function () {
      this.$store.commit("global/setLoader", true);
      this.loadCampaign();
      this.loadConfig();
      this.lockPing();
      if (this.cachedWindowId && this.cachedWindowId !== this.sessionWindowId) {
        this.$root.$toast(
          'Warning! this campaign is already open on another window.',
          {className: 'et-info'}
        );
      }
      setInterval(CampaignService.logTime, this.logTimeInterval, this.campaignId, this.logTimeInterval / 1000);
    }
  };
</script>

<style lang="less">
  @import '../../less/campaign';
  @stensul-white: #FFFFFF;
  @stensul-purple: #514960;
  @stensul-gray: #666666;
  @stensul-purple: #514960;
  @stensul-purple-light: lighten(@stensul-purple, 20%);
  @focus: #78dcd6;
  @focus-light: lighten(@focus, 30%);

  @brand-primary: lighten(@stensul-purple, 35%);
  @brand-secondary: @stensul-purple-light;
  
  .el-input.is-active .el-input__inner,
  .el-select .el-input__inner:focus,
  .el-select .el-input.is-focus .el-input__inner,
  .el-input__inner:focus {
    border-color: rgb(120, 220, 214);
  }
  .section-canvas-email{
    .mce-content-body{
      line-height: inherit;
    }
  }
  .beta-subheader{
    display: table-caption;
    width: 100%;
    min-width: 1280px;
    background-color: #FFFFFF;
    height: 45px;
    padding: 8px 10px;
    box-shadow: 0px 0px 4px #999999;
    overflow: hidden;
    position: sticky;
    top: 45px;
    z-index: 999;
    border-bottom: 1px solid #f4f4f4;
  }

  .container-campaign-subwrapper{
    width: 100%;
    position: relative;
    top: 0px;
    min-width: 1280px;
    overflow-x: auto;
    overflow-y: hidden;
    position: absolute;
    left: 0;
    top: 90px;
    bottom: 0px;
  }

  .module-container {
    padding: 40px 20px 80px 20px;
    background: #f0f0f0;
    display: block;
    float: left;
    height: calc(~"100vh - 53px");
    width: calc(~"100% - 540px");
    min-width: 640px;
    overflow-x: hidden;
    overflow-y: visible;
    table{
      border-collapse: initial;
    }
  }

  aside {
    width: 20%;
    background: @stensul-white;
    -ms-overflow-style: none;
  }

  .section-canvas-button-col{
    width: 700px
  }

 .switch-container{
    position: absolute;
    left: 50%;
    margin-left: -50px;
    width: 100px;
  }

  .switch {
    position: relative;
    height: 29px;
    width: 100px;
    background: @stensul-white;
    border-radius: 3px;
    margin: 0 auto;
    border: 1px solid #DFDFDF;
    margin-top: 2px;
  }

  .switch-label {
    position: relative;
    z-index: 2;
    float: left;
    width: 49px;
    line-height: 21px;
    font-size: 16px;
    color: @stensul-purple;
    text-align: center;
    cursor: pointer;
    margin: 0 !important;

    i {
      display: inline-block;
      margin-top: 7px;
    }

    i.glyphicon-phone{
      margin-top: 5px;
    }
  }

  .switch-label:active {
    font-weight: bold;
  }

  .switch-label-off {
    padding-left: 2px;
  }

  .switch-label-on {
    padding-right: 2px;
  }

  .switch-input {
    display: none;
  }

  .switch-input:checked + .switch-label {
    font-weight: bold;
    color: @stensul-white;
    -webkit-transition: 0.15s ease-out;
    -moz-transition: 0.15s ease-out;
    -o-transition: 0.15s ease-out;
    transition: 0.15s ease-out;
  }

  .switch-input:checked + .switch-label-on ~ .switch-selection {
    left: 50px;
  }

  .switch-selection {
    display: block;
    position: absolute;
    z-index: 1;
    top: 2px;
    left: 2px;
    width: 46px;
    height: 23px;
    border-radius: 2px;
    background: @stensul-purple;
    -webkit-transition: left 0.15s ease-out;
    -moz-transition: left 0.15s ease-out;
    -o-transition: left 0.15s ease-out;
    transition: left 0.15s ease-out;
  }

  .slide-fade-enter-active {
    transition: all .3s ease;
  }

  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(50px);
    opacity: 0;
  }

  .mce-edit-focus{
    outline: 1px dotted #333!important;
  }
</style>

<style lang="less" scoped>
  .lock-warning-container {
    height: 1000px;
    padding: 40px 60px 0;
    background-color: #EDEDED;
    color: #999999;
    text-align: center;
  }
</style>
