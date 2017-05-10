<template>
  <div class="section-container-campaign">

    <!-- column left (menu) -->
    <aside>
      <div class="menu-campaign">
        <campaign-configuration v-if="dataLoaded"></campaign-configuration>
        <campaign-menu v-if="dataLoaded"></campaign-menu>
      </div>
    </aside>

    <!-- column right (container email) -->
    <section class="section-canvas-email section-box">
      <email-canvas v-if="dataLoaded" @save-campaign="saveCampaign"></email-canvas>
    </section>

  </div>
</template>

<script>
  import CampaignConfiguration from './CampaignConfiguration.vue'
  import CampaignMenu from './CampaignMenu.vue'
  import EmailCanvas from './EmailCanvas.vue'

  export default {
    name: 'Campaign',
    components: {
      CampaignConfiguration,
      CampaignMenu,
      EmailCanvas
    },
    data: function () {
      return {
        dataLoaded: false,
        loading: true
      }
    },
    methods: {
      saveCampaign() {
        this.loading = true;
        this.$store.dispatch("saveCampaign").then(response => {
          this.$root.$toast('This email was saved successfully.', {className: 'et-info'});
          this.loadCampaign();
        }, error => {
          this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-warn'});
        });
      },
      loadCampaign() {
        let _this = this;
        // TODO: Pass campaignId HERE
        this.$store.dispatch("getCampaignData").then(response => {
          this.loading = false;
          this.dataLoaded = true;
        }, error => {
          this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-warn'});
        });
      }
    },
    mounted: function () {
      this.loadCampaign();
    }
  };
</script>