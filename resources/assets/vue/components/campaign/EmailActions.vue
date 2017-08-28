<template>
  <div class="section-box-header section-canvas-title">
    <div class="row">
      <div class="col-xs-3 col-md-4 col-lg-3" id="section-canvas-title-col">
        <h2>{{ campaign.campaign_data.library_config.title || 'Campaign Editor' }}</h2>
      </div>

      <div class="col-xs-1 col-md-1 col-lg-2">
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

      <div class="col-xs-8 col-md-7 col-lg-7 text-right" id="section-canvas-buttons-col">

        <button class="btn btn-default campaign-preview" :class="hiddenClass()" @click="preview">
          Preview
        </button>

        <button class="btn btn-default save-as-draft" :class="hiddenClass()" v-if="!campaign.campaign_data.template" @click="save">
          Save as Draft
        </button>

        <!--
          Show if it's not already a template, if it's not a processed campaign
          and templating is enabled on the tool.
        -->
        <b-btn v-b-modal.confirm-modal class="btn btn-default save-as-template"
          v-if="campaignConfig.enable_templating && !campaign.campaign_data.template && !campaign.processed
            && campaign.campaign_data.library_config.templating">
          Save as Template
        </b-btn>

        <!--
          Show if it's already a template, skip confirmation modal.
        -->
        <button class="btn btn-default save-as-template" @click="template()"
          :class="hiddenClass()" v-if="campaign.campaign_data.template">
          Save Template
        </button>

        <button class="btn btn-default proof-open-modal" v-if="!campaign.campaign_data.template && this.$app.proofConfig.status"
            v-bind:data-campaign-id="campaign.campaign_id" @click="proof"
        >Send for review</button>

        <a class="btn btn-continue campaign-continue" :class="hiddenClass()" v-if="!campaign.campaign_data.template" @click="complete">
          Complete
          <i class="glyphicon glyphicon-triangle-right"></i>
        </a>
      </div>
    </div>
    <b-modal v-if="campaignConfig.enable_templating"
      id="confirm-modal"
      ref="confirmModal"
      title="Save as Template"
      ok-title="Accept"
      close-title="Cancel"
      @ok="confirmSave">
      Remember that if you save this campaign as template, you won't be able to publish it,
      you will only be able to edit and clone it.
    </b-modal>
  </div>
</template>

<script>

  import campaignService from '../../services/campaign';
  import configService from '../../services/config'

  export default {
    name: 'EmailActions',
    computed: {
      campaign () {
        return this.$store.getters["campaign/campaign"];
      },
      dirty() {
        return this.$store.getters["campaign/dirty"];
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
        this._save().then(response => {
          this.$root.$toast('Email saved', {className: 'et-info'});
          this.$store.commit("global/setLoader", false);
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-error'});
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
        const bodyHtml = document.getElementsByClassName('section-canvas-container')[0].innerHTML;

        // Save Request
        this._save(bodyHtml).then(() => {
          // Process Campaign
          this.$store.dispatch("campaign/completeCampaign", this.campaign)
            .then(completeResponse => {

              // Set processed
              if (completeResponse.processed) {
                this.$store.commit('campaign/setProcessStatus');

                // Process plain text version
                if (this.campaign.library_config.plainText) {
                  this.plainText(this.campaign.campaign_id);
                }
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
            this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-error'});
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
        this._save().then(response => {
          this.$store.commit("global/setLoader", false);
          this.$store.commit("campaign/toggleModal", 'modalPreview');
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-error'});
        });
      },
      proof() {
        this.$store.commit("global/setLoader", true);
        this._save().then(response => {
          this.$store.commit("global/setLoader", false);
          this.$store.commit("campaign/toggleModal", 'modalProof');
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-error'});
        });
      },
      plainText(campaignId) {
        campaignService.processPlainText(campaignId)
          .then((response) => {
          this.$store.commit("campaign/setPlainText", response);
            })
          .catch((error) => {
            this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-error'});
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