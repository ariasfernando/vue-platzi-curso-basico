<template>
  <div class="section-container-campaign">

    <!-- column left (menu) -->
    <aside>
      <div class="menu-campaign">
        <campaign-configuration v-if="ready"></campaign-configuration>
        <campaign-menu v-if="ready"></campaign-menu>
      </div>
    </aside>

    <!-- column right (container email) -->
    <section class="section-canvas-email section-box">
      <email-canvas v-if="ready"></email-canvas>
    </section>

    <aside class="component-settings-wrapper">
      <column-settings v-if="currentComponent"></column-settings>
      <component-settings v-if="currentComponent"></component-settings>
    </aside>

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
  import ColumnSettings from './ColumnSettings.vue'
  import Spinner from '../common/Spinner.vue'

  export default {
    name: 'Campaign',
    props: ['campaignId'],
    components: {
      CampaignConfiguration,
      CampaignMenu,
      EmailCanvas,
      ComponentSettings,
      ColumnSettings,
      ModalComplete,
      ModalPreview,
      ModalProof,
      Spinner
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

  .component-settings-wrapper {
    background: none;

    .component-settings {
      background: #FFFFFF;
      border-radius: 5px;
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
  }
</style>