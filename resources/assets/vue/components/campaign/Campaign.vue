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
      <email-canvas v-if="ready" @save-campaign="saveCampaign"></email-canvas>
    </section>

    <spinner></spinner>

  </div>
</template>

<script>
  import CampaignConfiguration from './CampaignConfiguration.vue'
  import CampaignMenu from './CampaignMenu.vue'
  import EmailCanvas from './EmailCanvas.vue'
  import Spinner from '../common/Spinner.vue'

  export default {
    name: 'Campaign',
    props: ['campaignId'],
    components: {
      CampaignConfiguration,
      CampaignMenu,
      EmailCanvas,
      Spinner
    },
    data: function () {
      return {
        ready: false,
      }
    },
    computed: {
      campaign() {
        return this.$store.campaign.campaign;
      },
      library() {
        return this.$store.campaign.library;
      }
    },
    methods: {
      saveCampaign() {
        this.$store.commit("global/setLoader", true);
        this.$store.dispatch("campaign/saveCampaign").then(response => {
          this.$root.$toast('This email was saved successfully.', {className: 'et-info'});
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-error'});
        });
      },
      loadCampaign() {
        this.$store.dispatch("campaign/getCampaignData", this.campaignId).then(response => {
          this.$store.commit("global/setLoader", false);
          this.ready = true;
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-error'});
        });
      }
    },
    created: function () {
      this.loadCampaign();
    }
  };
</script>