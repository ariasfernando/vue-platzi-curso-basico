<template>
  <div class="section-container-campaign">
    <email-actions v-if="ready"></email-actions>

    <div class="container-campaign-subwrapper" v-sticky="{ zIndex: 997, stickyTop: 53 }">
      <!-- column left (menu) -->
      <aside>
        <div class="aside-inner">
          <div class="menu-campaign">
            <campaign-configuration v-if="ready"></campaign-configuration>
            <campaign-menu v-if="ready"></campaign-menu>
          </div>
        </div>
      </aside>

      <!-- column right (container email) -->
      <section class="section-canvas-email section-box">
        <email-canvas v-if="ready"></email-canvas>
      </section>

      <aside class="component-settings-wrapper">
        <div class="aside-inner section-box">
          <module-settings v-if="currentComponent"></module-settings>
          <component-settings v-if="currentComponent"></component-settings>
        </div>
      </aside>
    </div>

    <!-- Modals -->
    <modal-complete v-if="ready"></modal-complete>
    <modal-preview v-if="ready"></modal-preview>
    <modal-proof v-if="ready"></modal-proof>

    <spinner></spinner>

  </div>
</template>

<script>
  import CampaignConfiguration from './CampaignConfiguration.vue'
  import ModalComplete from './modals/ModalComplete.vue'
  import ModalPreview from './modals/ModalPreview.vue'
  import ModalProof from './modals/ModalProof.vue'
  import CampaignMenu from './CampaignMenu.vue'
  import EmailCanvas from './EmailCanvas.vue'
  import ComponentSettings from './ComponentSettings.vue'
  import ModuleSettings from './ModuleSettings.vue'
  import Spinner from '../common/Spinner.vue'
  import EmailActions from './EmailActions.vue'
  import VueSticky from 'vue-sticky'

  export default {
    name: 'Campaign',
    props: ['campaignId'],
    components: {
      CampaignConfiguration,
      CampaignMenu,
      EmailCanvas,
      ComponentSettings,
      ModuleSettings,
      ModalComplete,
      ModalPreview,
      ModalProof,
      Spinner,
      EmailActions
    },
    data: function () {
      return {
        ready: false,
      }
    },
    computed: {
      campaign() {
        return this.$store.getters["campaign/campaign"];
      },
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      }
    },
    directives: {
      'sticky': VueSticky,
    },
    methods: {
      loadCampaign() {
        this.$store.dispatch("campaign/getCampaignData", this.campaignId).then(response => {
          this.$store.commit("global/setLoader", false);
          this.ready = true;
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
        });
      }
    },
    created: function () {
      this.$store.commit("global/setLoader", true);
      this.loadCampaign();
    }
  };
</script>

<style lang="less">
  @import '../../less/campaign';
  @stensul-white: #FFFFFF;
  @stensul-purple: #514960;

  .beta-subheader{
    display: table-caption;
    width: 100%;
    min-width: 1200px;
    background-color: #FFFFFF;
    height: 53px;
    padding: 11px 10px;
    box-shadow: 0px 0px 4px #999999;
    overflow: hidden;
  }

  .container-campaign-subwrapper{
    height:calc(~"100vh - 53px"); 
    width:100%;
  }

  .component-settings-wrapper {
    background: none;

    .component-settings {
      background: #FFFFFF;
      border-radius: 0px;
      border: 1px solid transparent;
      height: 100%;
      display: table;
      width: 100%;
      padding: 0px;

      h2{
        color: #555555;
        font-weight: 300;
        font-size: 13px;
        padding: 15px 10px 13px 10px;
        border-bottom: 1px solid #F0F0F0;
        margin-top: 0px;
      }

      .plugins{
        padding: 10px;
      }

      .plugin-wrapper{
        display: table;
        width: 100%;

        div {
          span{
            display: block;
            width: 100%;
          }
        }

        label{
          text-align: left;
          color: #666666;
          padding-top: 2px;
          font-weight: 300;
          font-size: 13px;
          margin-bottom: 0px;
        }

        input[type=text]{
          height: 22px;
          background: #F4F4F4;
          border-radius: 2px;
          border: none;
          float: right;
          font-size: 11px;
          font-weight: 300;
          width: 120px;
        }

        select{
          height: 22px;
          font-size: 11px;
          color: #666666;
          border: none;
          background: #f4f4f4;
          box-shadow: none;
          font-weight: 300;
          width: 75px;
          float: right;
        }

      }

      .plugin-destination-url{
        span{

          &:last-child{
            margin-top: 10px;
          }
        }
      }

      .plugin-upload-image{
        input{
          width: 100%
        }

        label{
          margin-bottom: 7px;
        }
      }
    }
  }

  aside {
    width: 20%;

    .section-box {
      background-color: none;
    }
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
            vertical-align: sub;
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
</style>