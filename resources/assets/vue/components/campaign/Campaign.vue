<template>
  <div class="section-container-campaign">
    <email-actions v-if="campaignReady && campaignConfigReady"></email-actions>

    <div class="container-campaign-subwrapper">
      <div class="beta-wrapper"></div>
      <!-- column left (menu) -->
      <aside :style="locked ? 'overflow-y: hidden;' : undefined" class="left-bar">
        <div>
          <div class="menu-campaign">
            <campaign-configuration v-if="campaignReady && campaignConfigReady"></campaign-configuration>
            <campaign-menu v-if="campaignReady && !locked" :library-id="libraryId"></campaign-menu>
            <div class="lock-warning-container" v-if="locked">Unfix the email to add modules</div>
          </div>
        </div>
      </aside>

      <!-- column right (container email) -->
      <section class="section-canvas-email module-container">
        <email-canvas v-if="campaignReady"></email-canvas>
      </section>

      <aside class="right-bar">
        <div>
          <module-settings v-if="showModuleSettings"></module-settings>
          <component-settings v-if="Object.keys(currentComponent).length > 0 && !showModuleSettings"></component-settings>
          <custom-module-settings v-if="currentCustomModule"></custom-module-settings>
        </div>
      </aside>
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
  import CampaignConfiguration from './CampaignConfiguration.vue'
  import ModalComplete from './modals/ModalComplete.vue'
  import ModalPreview from './modals/ModalPreview.vue'
  import ModalProof from './modals/ModalProof.vue'
  import ModalEsp from './modals/ModalEsp.vue'
  import ModalEnableTemplating from './modals/ModalEnableTemplating.vue'
  import CampaignMenu from './CampaignMenu.vue'
  import EmailCanvas from './EmailCanvas.vue'
  import ComponentSettings from './ComponentSettings.vue'
  import CustomModuleSettings from './CustomModuleSettings.vue'
  import ModuleSettings from './ModuleSettings.vue'
  import Spinner from '../common/Spinner.vue'
  import EmailActions from './EmailActions.vue'
  import VueSticky from 'vue-sticky'
  import _ from 'lodash'
  import CampaignService from '../../services/campaign'

  export default {
    name: 'Campaign',
    props: ['campaignId', 'libraryId', 'windowId', 'cachedWindowId'],
    components: {
      CampaignConfiguration,
      CampaignMenu,
      EmailCanvas,
      ComponentSettings,
      CustomModuleSettings,
      ModuleSettings,
      ModalComplete,
      ModalPreview,
      ModalProof,
      ModalEsp,
      ModalEnableTemplating,
      Spinner,
      EmailActions
    },
    data: function () {
      return {
        campaignReady: false,
        campaignConfigReady: false,
        pingLockInterval: 30000,
        logTimeInterval: 30000,
      }
    },
    computed: {
      campaign() {
        return this.$store.getters["campaign/campaign"];
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
  .right-bar,
  .left-bar {
    height: calc(~"100vh - 86px");
    overflow: auto;
    overflow: overlay;
    width: 270px;
    display: block;
    float: left;
    padding: 0px;
    font-family: 'Open Sans', Helvetica, Arial, sans-serif;
    padding-bottom: 25px;

    &:hover{
      overflow: overlay
    }

    &::-webkit-scrollbar {
        width: 2px; 
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: lighten(@stensul-gray, 40%);
    }
    .btn.btn-secondary.btn-block {
      &:hover,
      &:visited,
      &:focus,
      &:active,
      &:active:focus {
        color: #666666;
      }
    }
    .fa.pull-left {
      margin-right: 12px;
    }

    .components-list {
      padding: 0;
      margin: 0;

      .component-item {
        cursor: pointer;
        list-style-type: none;
        font-size: 14px;
        background-color: #f4f4f4;
        border: 1px solid #d8d8d8;
        padding: 20px 20px 14px 20px;
        width: 47%;
        margin-right: 4px;
        margin-bottom: 4px;
        float: left;
        text-align: center;
        transition: all 0.3s linear;

        i {
          margin: 0 5px;
          color: #514960;
          font-size: 28px;
        }
        p {
          display: inline-block;
          font-size: 12px;
          margin: 0px;
          padding: 0px;
          font-weight: 400px;
          color: #666666;
          width: 100%;
          font-weight: 300;
          text-align: center;
        }

        &:hover {
          border: 1px solid #888888;

          p {
            color: #333333;
          }
        }
      }
    }

    .card {
      padding: 0 8px 15px 8px;
      border-bottom: 1px solid #f0f0f0;
      border-top: 1px solid #ffffff;
      margin-top: -1px;
      display: table;
      width: 100%;
    }

    select {
      height: 22px;
      font-size: 11px;
      color: #666666;
      border: none;
      background: #f4f4f4;
      box-shadow: none;
      font-weight: 300;
      width: 65px;
      float: right;
    }

    select[multiple] {
      height: 50px;
    }

    .vue-js-switch {
      float: right;
      padding-top: 0px;
      margin: 0px;
    }

    .content-colorpicker {
      .sketch-picker {
        display: none;
        position: absolute !important;
        z-index: 300;
        right: 100%;
      }
      .icon-remove {
        color: #999999;
        background: #ffffff;
        border: 1px solid #cccccc;
        margin-top: -40px;
        margin-left: -35px;
        padding-top: 4px;
      }
    }
  }

  .card-header {
    padding-bottom: 10px;
    ul {
      margin-left: -10px;
      margin-right: -10px;
      border-bottom: 1px solid #dddddd;

      .nav-item {
        border-top: 1px solid #dddddd;
        border-left: 1px solid #dddddd;
        margin-bottom: -2px;

        &:first-child {
          margin-left: 10px;
        }

        &:last-of-type {
          border-right: 1px solid #dddddd;
        }
        .nav-link {
          margin-right: 0;
          padding: 4px 7px;
          border: 0;
          border-radius: 0;
          font-weight: 300;
          color: #666666;
          &.active {
            border-bottom: 2px solid @focus;
            background: @focus-light;
          }
          &:focus {
            background-color: transparent;
          }
          &:hover {
            background-color: @focus-light;
          }
        }
      }
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
