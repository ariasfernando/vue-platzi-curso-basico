<template>
  <div class="section-container-campaign">
    <email-actions v-if="ready"></email-actions>

    <div class="container-campaign-subwrapper">
      <div class="beta-wrapper"></div>
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
          <transition name="slide-fade">
            <module-settings v-if="Object.keys(currentComponent).length > 0"></module-settings>
          </transition>
          <transition name="slide-fade">
            <component-settings v-if="Object.keys(currentComponent).length > 0"></component-settings>
          </transition>
          <transition name="slide-fade">
            <custom-module-settings v-if="currentCustomModule"></custom-module-settings>
          </transition>
        </div>
      </aside>
    </div>

    <!-- Modals -->
    <modal-complete v-if="ready"></modal-complete>
    <modal-preview v-if="ready"></modal-preview>
    <modal-esp v-if="ready"></modal-esp>
    <modal-proof v-if="ready"></modal-proof>
    <modal-enable-templating v-if="ready"></modal-enable-templating>

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

  export default {
    name: 'Campaign',
    props: ['campaignId'],
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
        ready: false,
      }
    },
    computed: {
      campaign() {
        return this.$store.getters["campaign/campaign"];
      },
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      },
      currentCustomModule() {
        return !_.isUndefined(this.$store.getters["campaign/currentCustomModule"]);
      },
      dirty() {
        return this.$store.getters["campaign/dirty"];
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
        this.$store.dispatch("campaign/getCampaignData", this.campaignId).then(response => {
          this.$store.commit("global/setLoader", false);
          this.ready = true;
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
        });
      },
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
    height: 45px;
    padding: 8px 10px;
    box-shadow: 0px 0px 4px #999999;
    overflow: hidden;
    position: sticky;
    top: 45px;
    z-index: 1000;
  }

  .container-campaign-subwrapper{
    height: calc(~"100vh - 90px");
    width: 100%;
    position: relative;
    top: 0px;
    min-width: 1200px;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .component-settings-wrapper {
    background: @stensul-white;

    .component-settings {
      background: #FFFFFF;
      border-radius: 0px;
      border: 1px solid transparent;
      height: 100%;
      display: table;
      width: 100%;
      padding: 0px;

      h2{
        color: #666666;
        font-weight: 300;
        font-size: 13px;
        padding: 15px 10px 13px 10px;
        border-bottom: 1px solid #F0F0F0;
        margin-top: 0px;
        text-transform: uppercase;

        i{
          font-size: 10px;
        }
      }

      .plugins{
        padding: 10px;
        padding-bottom: 90px;

        .settings-wrapper{
          padding-bottom: 50px;
        }
      }

      .plugin-wrapper{
        display: table;
        width: 100%;

        .plugin-wrapper-inner:first-child{
          background: #f4f4f4;
          margin-bottom: 7px;
          padding: 10px;
          border: 1px solid #E9E9E9;
          width: 100%;
          display: table;
          border-radius: 2px;
        }

        .plugin-wrapper-inner:empty{
          background: none;
          margin-bottom: 0px;
          padding: 0px;
          border: none;
        }

        .plugin-wrapper-inner {
          span{
            display: block;
            width: 100%;
          }
        }

        label{
          text-align: left;
          color: #666666;
          margin-bottom: 6px;
          font-weight: 300;

          &.label-custom{
            display: inline-block;
            margin: 0 0px 10px 0;
          }
          font-size: 12px;
          margin-bottom: 5px;
          width: 100%;
          display: block;
        }

        input[type=text]{
          height: 28px;
          background: #FFFFFF;
          border-radius: 2px;
          border: none;
          float: right;
          font-size: 11px;
          font-weight: 300;
          width: 100%;
          border: 1px solid #EEEEEE;
          padding: 7px;

          &:focus{
            outline: 0;
          }
        }

        select{
          height: 28px;
          font-size: 11px;
          color: #666666;
          border: none;
          background: #FFFFFF;
          box-shadow: none;
          font-weight: 300;
          width: 100%;
          float: right;
          border: 1px solid #EEEEEE;

          &:focus{
            outline: 0;
          }
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
    background: @stensul-white;
  }

  .section-canvas-button-col{
    width: 700px
  }

  .switch-container{
    position: relative;
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
