<template>
  <div class="beta-subheader">
    <div class="section-box-header section-canvas-title">
      <div class="row">

        <div class="col-xs-2 col-md-2 col-lg-2">
          <div class="switch">
            <input type="radio" class="switch-input" name="view" value="desktop" id="desktop" @click="switchMode('desktop')" checked>
            <label for="desktop" class="switch-label switch-label-off campaign-switch-view">
              <i class="fa fa-desktop"></i>
            </label>
            <input type="radio" class="switch-input" name="view" value="mobile" id="mobile" @click="switchMode('mobile')">
            <label for="mobile" class="switch-label switch-label-on campaign-switch-view">
              <i class="glyphicon glyphicon-phone"></i>
            </label>
            <span class="switch-selection"></span>
          </div>
        </div>

        <div class="col-xs-10 col-md-10 col-lg-10 text-right" id="section-canvas-buttons-col">

          <button v-show="!locked" class="btn btn-default campaign-preview beta-btn-secondary" :class="hiddenClass()" @click="preview">
            Preview
          </button>

          <button v-show="!locked" class="btn btn-default save-as-draft beta-btn-secondary" :class="hiddenClass()" v-if="!campaign.campaign_data.template" @click="save">
            Save as Draft
          </button>

          <!--
            Show if it's not already a template, if it's not a processed campaign
            and templating is enabled on the tool.
          -->
          <b-btn v-b-modal.confirm-modal class="btn btn-default save-as-template beta-btn-secondary"
            v-show="!locked"
            v-if="campaignConfig.enable_templating && !campaign.campaign_data.template && !campaign.processed
              && campaign.campaign_data.library_config.templating">
            Save as Template
          </b-btn>

          <!--
            Show if it's already a template, skip confirmation modal.
          -->
          <button class="btn btn-default save-as-template beta-btn-secondary" @click="template()"
            :class="hiddenClass()" v-if="campaign.campaign_data.template"
            v-show="!locked">
            Save Template
          </button>

          <button class="btn btn-default proof-open-modal beta-btn-secondary" v-if="!campaign.campaign_data.template && this.$app.proofConfig.status"
              v-bind:data-campaign-id="campaign.campaign_id" @click="proof"
              v-show="!locked"
          >Send for Review</button>

          <a class="btn campaign-continue beta-btn-primary" :class="hiddenClass()" v-if="!campaign.campaign_data.template" @click="complete"
            v-show="!locked">
            Complete
            <i class="glyphicon glyphicon-triangle-right"></i>
          </a>
        </div>
      </div>
      <b-modal v-if="campaignConfig.enable_templating"
        id="confirm-modal"
        ref="confirmModal" 
        ok-title="Accept"
        close-title="Cancel"
        @ok="confirmSave">
        <h4>Save as Template</h4>
        Remember that if you save this campaign as template, you won't be able to publish it,
        you will only be able to edit and clone it.
      </b-modal>
    </div>
  </div>
</template>

<script>

  import campaignService from '../../services/campaign';
  import configService from '../../services/config';
  import campaignCleaner from '../../utils/campaignCleaner';

  export default {
    name: 'EmailActions',
    computed: {
      campaign () {
        return this.$store.getters["campaign/campaign"];
      },
      dirty() {
        return this.$store.getters["campaign/dirty"];
      },
      locked() {
        return this.$store.getters["campaign/campaign"].campaign_data.locked
      }
    },
    data () {
      return {
        title  () {
          let libraryTitle = this.campaign.campaign_data.library_config.title || 'Campaign Editor';

          // Set language name
          if (this.campaign.campaign_format === "languages" && this.campaign.locale.langs[this.campaign.locale.name]) {
            libraryTitle += "(" + this.campaign.locale.langs[this.campaign.locale.name] + ")";
          }

          return libraryTitle;
        },
        titleCols: 3,
        buttonsCols: 5,
        hiddenClass () {
          return this.campaign.locked ? 'hidden' : '';
        },
        campaignConfig: {}
      }
    },
    methods: {
      switchMode(mode) {
        this.$store.commit("campaign/changeBuildingMode", mode);
      },
      save() {
        this.$store.commit("global/setLoader", true);
        const bodyHtml = campaignCleaner.clean('.section-canvas-container');
        this._save(bodyHtml).then(response => {
          this.$root.$toast('Email saved', {className: 'et-info'});
          this.$store.commit("global/setLoader", false);
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
        });
      },
      _save(bodyHtml = undefined) {
        return this.$store.dispatch("campaign/saveCampaign", {
          campaign: this.campaign,
          bodyHtml
        });
      },
      template() {
        this.$store.commit("campaign/setTemplating", true);
        this.save();
      },
      confirmSave(e) {
        e.cancel();
        this.template();
        this.$refs.confirmModal.hide()
      },
      checkProcessStatus(processId) {
        return campaignService.checkProcessStatus(processId);
      },
      complete() {
        // Show Loader
        this.$store.commit("global/setLoader", true);

        // Obtain current html
        const bodyHtml = campaignCleaner.clean('.section-canvas-container');

        // Save Request
        this._save(bodyHtml).then(() => {
          // Process Campaign
          this.$store.dispatch("campaign/completeCampaign", this.campaign)
            .then(completeResponse => {

              // Set processed
              if (completeResponse.processed) {
                this.$store.commit('campaign/setProcessStatus');
                // Hide Loader
                this.$store.commit("global/setLoader", false);
                // Show complete after campaign is completely processed
                this.$store.commit("campaign/toggleModal", 'modalComplete');
              }

              // Poll server with job id
              if (completeResponse.jobId) {
                let processInterval = setInterval(() => {
                  this.checkProcessStatus(completeResponse.jobId).then((response) => {
                    if (response.status === 'finished') {
                      clearInterval(processInterval);
                      this.$store.commit("global/setLoader", false);
                      // Set campaign as processed
                      this.$store.commit('campaign/setProcessStatus');
                      // Show complete after campaign is completely processed
                      this.$store.commit("campaign/toggleModal", 'modalComplete');
                    }
                  });
                }, 2000);
            }
          }, error => {
            this.$store.commit("global/setLoader", false);
            this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
          });
        });
      },
      autoSave() {
        setInterval(() => {
          if (this.dirty) {
            this._save().then(response => {
              this.$store.commit("global/setLoader", false);
            }, error => {
              this.$store.commit("global/setLoader", false);
              this.$root.$toast("Changes couldn't be saved", {className: 'et-error'});
            });
          }
        }, 20000);
      },
      preview() {
        this.$store.commit("global/setLoader", true);
        const bodyHtml = campaignCleaner.clean('.section-canvas-container');
        this._save(bodyHtml).then(response => {
          this.$store.commit("global/setLoader", false);
          this.$store.commit("campaign/toggleModal", 'modalPreview');
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
        });
      },
      proof() {
        this.$store.commit("global/setLoader", true);
        const bodyHtml = campaignCleaner.clean('.section-canvas-container');
        this._save(bodyHtml).then(response => {
          this.$store.commit("global/setLoader", false);
          this.$store.commit("campaign/toggleModal", 'modalProof');
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
        });
      },
    },
    created () {
      this.autoSave();
      configService.getConfig('campaign').then((response) => this.campaignConfig = response);
      let saveAsTemplate = (!this.campaign.processed && this.campaign.campaign_data.library_config.templating);
      let isTemplate = this.campaign.campaign_data.template;

      if (!this.campaign.campaign_data.library_config.building_mode_select) {
        this.titleCols += 2;
      }

      if (saveAsTemplate && !isTemplate) {
        this.buttonsCols += 2;
      } else {
        this.titleCols += 2;
      }
    },
  };
</script>