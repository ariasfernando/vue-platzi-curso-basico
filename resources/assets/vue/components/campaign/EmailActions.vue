<template>
  <div class="beta-subheader" v-sticky="{ zIndex: 9997, stickyTop: 0 }">
    <div class="section-box-header section-canvas-title">
      <div class="row">
        <div class="col-xs-5 col-md-5 col-lg-5 hidden-sm hidden-xs"></div>

        <div class="col-xs-7 col-md-5 col-lg-5 text-right pull-right" id="section-canvas-buttons-col">

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
          <b-btn @click="template" class="btn btn-default save-as-template beta-btn-secondary"
            v-show="!locked"
            v-if="campaignConfig.enable_templating && !campaign.campaign_data.template && !campaign.processed
              && campaign.campaign_data.library_config.templating">
            Save as Template
          </b-btn>

          <!--
            Show if it's already a template, skip confirmation modal.
          -->
          <button class="btn btn-default save-as-template beta-btn-secondary" @click="template"
            :class="hiddenClass()" v-if="campaign.campaign_data.template"
            v-show="!locked">
            Save Template
          </button>

          <button class="btn btn-default proof-open-modal beta-btn-secondary"
            v-if="!campaign.campaign_data.template && proofAccess.allow && proofAccess.status"
            v-bind:data-campaign-id="campaign.campaign_id" @click="proof"
            v-show="!locked"
          >Send for Review</button>

          <a class="btn campaign-continue beta-btn-primary" :class="{ 'hidden': campaign.locked, 'button-disabled': errors.length } " v-if="!campaign.campaign_data.template" @click="complete"
            v-show="!locked" >
            Complete
            <i class="glyphicon glyphicon-menu-right"></i>
          </a>
        </div>

        <div class="switch-container">
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
      </div>

    </div>
  </div>
</template>

<script>
  import VueSticky from 'vue-sticky';
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
      },
      fieldErrors() {
        return this.$store.state.campaign.fieldErrors;
      },
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
        campaignConfig: {},
        proofAccess: {
          status: this.$_app.config.proofConfig.status,
          allow: this.$_app.config.permissions.indexOf('edit_proof') >= 0
            && this.$_app.config.permissions.indexOf('access_proof') >= 0
        }
      }
    },
    directives: {
      'sticky': VueSticky,
    },
    methods: {
      switchMode(mode) {
        this.$store.commit("campaign/changeBuildingMode", mode);
      },
      save() {
        // Do not save if there are missing or wrong fields
        if (this.fieldErrors.length > 0) {
          this.$root.$toast(
            'To continue, please make sure you have completed the Campaign Name, upload any missing images and complete any missing Destination URLs, ' +
            'or remove the incomplete module(s).',
            {
              className: 'et-error',
              duration: 10000,
            }
          );
          return false;
        }

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
        this.$store.commit("campaign/toggleModal", 'modalEnableTemplating');
      },
      checkProcessStatus(processId) {
        return campaignService.checkProcessStatus(processId);
      },
      complete() {
        // Do not save if there are missing or wrong fields
        if (this.fieldErrors.length > 0) {
          this.$root.$toast(
            'To continue, please make sure you have completed the Campaign Name, upload any missing images and complete any missing Destination URLs, ' +
            'or remove the incomplete module(s).',
            {
              className: 'et-error'
            }
          );
          return false;
        }

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

<style>
  .button-disabled {
    cursor: not-allowed;
  }
</style>