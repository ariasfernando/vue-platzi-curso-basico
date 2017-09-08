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
    padding-left: 20px;

    .component-settings {
      background: #FFFFFF;
      border-radius: 5px;
      padding: 0 15px;
      border: 1px solid transparent;
    }
  }

  aside {
    width: 20%;
  }
</style>