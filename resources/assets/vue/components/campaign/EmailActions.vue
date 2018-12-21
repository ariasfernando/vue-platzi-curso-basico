<template>
  <div class="beta-subheader">
    <div class="section-box-header section-canvas-title">
      <div class="row">
        <div class="col-xs-5 col-md-5 col-lg-5">
          <div v-if="showLibraryName" class="subheader-title">
              {{ libraryName }}
          </div>
        </div>

        <div class="col-xs-7 col-md-5 col-lg-5 text-right pull-right" id="section-canvas-buttons-col">

          <button class="btn btn-default campaign-preview beta-btn-secondary" :class="hiddenClass()" @click="preview">
            Preview
          </button>

          <button class="btn btn-default save-as-draft beta-btn-secondary" :class="hiddenClass()" v-if="!campaign.campaign_data.template" @click="save">
            Save as Draft
          </button>

          <!--
            Show if it's not already a template, if it's not a processed campaign
            and templating is enabled on the tool.
          -->
          <b-btn @click="template" class="btn btn-default save-as-template beta-btn-secondary"
            v-if="$can('create_template') && campaignConfig.enable_templating && !campaign.campaign_data.template && !campaign.processed
              && campaign.campaign_data.library_config.templating">
            Save as Template
          </b-btn>

          <!--
            Show if it's already a template, skip confirmation modal.
          -->
          <button class="btn btn-default save-as-template beta-btn-secondary" @click="template"
            :class="hiddenClass()" v-if="campaign.campaign_data.template">
            Save Template
          </button>

          <button class="btn btn-default proof-open-modal beta-btn-secondary"
            v-if="!campaign.campaign_data.template && proofAccess.allow && proofAccess.status"
            v-bind:data-campaign-id="campaign.campaign_id" @click="proof"
            v-show="!locked"
          >Send for Review</button>

          <a class="btn campaign-continue beta-btn-primary" :class="{ 'hidden': campaign.locked, 'button-disabled': errors.length } " v-if="campaign.campaign_data.can_be_processed && !campaign.campaign_data.template" @click="complete"
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
    <b-modal ref="noApprovedModal" hide-footer title="Using Component Methods" class="modal-approved">
      <div class="d-block text-center">
        <br/>
        <h4>Pending approval</h4>
        <p>This email has pending feedback from <b>{{ unApprovedemails.join(', ') }}</b>. To view the status of all reviews, <a @click="showProofTracking()" >click here</a> , otherwise hit OK below to complete the email</p><br/><br/>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default beta-btn-secondary" @click="$refs.noApprovedModal.hide();">Cancel</button>
        <button class="btn btn-default beta-btn-primary" @click="isApproved = true; complete();">Ok</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import VueSticky from 'vue-sticky';
  import campaignService from '../../services/campaign';
  import dashboardService from '../../services/dashboard';
  import campaignCleaner from '../../utils/campaignCleaner';
  import proofService from '../../services/proof';
  import { html_beautify } from 'js-beautify';
  import TrackingMixin from './mixins/trackingMixin'
  import _ from 'lodash'


  export default {
    name: 'EmailActions',
    mixins: [ TrackingMixin ],
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
      modules() {
        return this.$store.getters["campaign/modules"];
      },
      moduleErrors() {
        return this.$store.getters["campaign/moduleErrors"];
      },
      libraryName () {
        if( this.campaign.campaign_data.library_name.length > 50 ){
          return this.campaign.campaign_data.library_name.substring(0,50) + "...";
        }else{
          return this.campaign.campaign_data.library_name;
        }
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
        },
        trackingEnabled: false,
        showLibraryName: false,
        isApproved: false,
        unApprovedemails: [],
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
        this.$store.commit("global/setLoader", true);

        var cleanHtml = campaignCleaner.clean('.section-canvas-container');

        if (this.trackingEnabled) {
          cleanHtml = this.addTrackingParams(cleanHtml);
        }

        const bodyHtml = html_beautify(cleanHtml, {
          'indent_size': 2
        });

        // Save Request
        this._save(bodyHtml).then(() => {
          this.$root.$toast('Email saved', {className: 'et-info'});
          this.$store.commit("global/setLoader", false);
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
        });
      },
      _save(bodyHtml = undefined) {
        const promise = this.$store.dispatch("campaign/saveCampaign", {
          campaign: this.campaign,
          bodyHtml
        });
        promise.then(response => {

        }, error => {
          this.$store.commit("global/setLoader", false);
          let message = 'Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.';

          if (error.status === 422) {
            if (error.body.errors) {
              if (error.body.errors.campaign_name || error.body.errors.campaign_preheader) {
                message = 'HTML like tags are not allowed on Email Name and Preheader Text, please correct it to continue.';
              }
            }
          }
          this.$root.$toast(
            message,
            {className: 'et-error'}
          );
        });
        return promise;
      },
      _validate(customMessage = undefined) {
      	let errorMessage = '';
        if (this.$_app.utils.validator.imagesErrors('#emailCanvas')) {
        	errorMessage = 'To continue please upload all missing images.';
        }
       	if (this.moduleErrors) {
       		errorMessage = 'To continue please configure properly all modules.';
       	}
       	if (!this._validateEmptyCampaignName()) {
        	errorMessage = 'To continue please complete the email name.';
       	}
        if (this.$_app.utils.validator.tinyErrors('#emailCanvas')) {
          errorMessage = 'To continue please configure properly all text modules.';
        }
       	if (!this._validateEmptyEmail()) {
        	return false;
       	}

        if (errorMessage !== '') {
          this.$root.$toast(
            customMessage || errorMessage,
            {
              className: 'et-error',
              duration: 10000,
              closeable: true
            }
          );

          this.$_app.utils.validator.modulesErrors('#emailCanvas');
          this.$store.commit('campaign/campaignValidated', true);

          return false;
        }
        return true;
      },
      _validateEmptyEmail(message = undefined) {
        if (this.modules.length === 0) {
          this.$root.$toast(
            message || 'You cannot complete an empty email.',
            {
              className: 'et-error',
              closeable: true
            }
          );

          return false;
        }
        return true;
      },
      _validateEmptyCampaignName() {
      	if (this.$store.getters["campaign/campaign"].campaign_data.campaign_name === '') {
			       return false;
      	}
      	return true;
      },
      _approved(){
        if(!this.campaign.campaign_data.template && this.proofAccess.allow && this.proofAccess.status){
          if (this.isApproved === true) return true;
          proofService.getJSON('reviewers', this.campaign.campaign_data._id).then((response) => {
            if (response && response.status === 'success') {
                this.unApprovedemails = response.data
                      .filter(function(r){
                        return r.decision === undefined || r.decision.indexOf('approve')=== false
                      }).map(function(r){
                        return r.email;
                      });
                if(this.unApprovedemails.length){
                  this.$refs.noApprovedModal.show();
                  return false;
                }else{
                  this.isApproved = true;
                  this.complete();
                }
            }
          })
          .catch((error) => {
            this.$root.$toast(error, {className: 'et-error'});
          });
          return false;
        }
        return true;
      },
      showProofTracking(){
        this.$store.commit('campaign/toggleModal', 'modalProofTrack');
        return true;
      },
      template() {
        this.$store.commit("campaign/toggleModal", 'modalEnableTemplating');
      },
      checkProcessStatus(processId) {
        return campaignService.checkProcessStatus(processId);
      },
      complete() {
        // Do not save if there are missing or wrong fields
        if (!this._validate()) {
          return false;
        }

        if(!this._approved()){
          return false;
        }

        // Show Loader
        this.$store.commit("global/setLoader", true);

        // Obtain current html
        var cleanHtml = campaignCleaner.clean('.section-canvas-container');

        if (this.trackingEnabled) {
          if (!this.validateTracking()) {
            this.$store.commit("global/setLoader", false);
            return false;
          }
          cleanHtml = this.addTrackingParams(cleanHtml);
        }

        const bodyHtml = html_beautify(cleanHtml, {
          'indent_size': 2
        });

        // Set campaign as processing
        this.$store.commit('campaign/setProcessingStatus');

        // Save Request
        this._save(bodyHtml).then(() => {
          // Process Campaign
          this.$store.dispatch("campaign/completeCampaign", this.campaign)
            .then(completeResponse => {

              let finishedProcessing = () => {
                // Set campaign as processed
                this.$store.commit('campaign/setProcessStatus');
                // Reload campaign data
                this.$store.dispatch("campaign/getCampaignData", this.campaign.campaign_id).then(() => {
                  // Show complete after campaign is completely processed
                  this.$store.commit("campaign/toggleModal", 'modalComplete');
                  // Redirect to `/dashboard` if user refreshes the page
                  window.history.replaceState(null, null, "?processed=true");
                });
              };

              // Set processed (if using "sync" as QUEUE_DRIVER)
              if (completeResponse.processed) {
                finishedProcessing();
              } else if (completeResponse.jobId) {
                // Poll server with job id when using an async queue driver.
                let processInterval = setInterval(() => {
                  this.checkProcessStatus(completeResponse.jobId).then((response) => {
                    if (response.status === 'finished') {
                      clearInterval(processInterval);
                      finishedProcessing();
                    }
                    else if (response.status === 'failed') {
                      clearInterval(processInterval);
                      this.$store.commit("global/setLoader", false);
                      this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, '
                        + 'please contact our support team.', {className: 'et-error'});
                    }
                  });
                }, 1000);
              }
          });
        });
      },
      autoSave() {
        setInterval(() => {
          if (this.dirty && this.campaign.campaign_data.auto_save !== false && this.$store.getters['campaign/isProcessing'] === false) {
            this.$store.commit("global/setSecondaryLoader", true);
            this._save().then(response => {
              this.$store.commit("global/setSecondaryLoader", false);
            });
          }
        }, 20000);
      },
      preview() {
        this.$store.commit("global/setLoader", true);
        const cleanHtml = campaignCleaner.clean('.section-canvas-container');

        const bodyHtml = html_beautify(cleanHtml, {
          'indent_size': 2
        });
        this._save(bodyHtml).then(response => {
          this.$store.commit("campaign/toggleModal", 'modalPreview');
        });
      },
      proof() {
        // Do not save if there are missing or wrong fields
        if ( this.$_app.utils.validator.imagesErrors('#emailCanvas') || this.moduleErrors  ) {
          this.$_app.utils.validator.modulesErrors('#emailCanvas');

          this.$root.$toast(
            'To continue, please make sure you have completed the Email Name, upload any missing images and complete any missing Destination URLs, ' +
            'or remove the incomplete module(s).',
            {
              className: 'et-error',
              closeable: true
            }
          );

          this.$store.commit('campaign/campaignCompleted', true);
          return false;
        }
        // Do not show proof modal if there are missing or wrong fields
        let validateMessage = 'To send an email for review, please make sure you have completed the Campaign Name, upload any missing images and complete any missing Destination URLs, or remove the incomplete module(s). Missing areas are now highlighted in red below.';
        if (!this._validateEmptyEmail('You cannot send for review an empty email.')) {
          return false;
        }

        this.$store.commit("global/setLoader", true);
        const cleanHtml = campaignCleaner.clean('.section-canvas-container');

        const bodyHtml = html_beautify(cleanHtml, {
          'indent_size': 2
        });

        this._save(bodyHtml).then(response => {
          this.$store.commit("global/setLoader", false);
          this.$store.commit("campaign/toggleModal", 'modalProof');
        });
      },
    },
    created () {
      this.autoSave();
      this.campaignConfig = this.$store.getters["config/config"].campaign;
      this.trackingEnabled = (_.has(this.campaign.campaign_data.library_config, 'tracking') && this.campaign.campaign_data.library_config.tracking);
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
      dashboardService.getMenu().then((response) => {
        if(response.length > 1){
          this.showLibraryName = true;
        }
      })
    },
  };
</script>

<style lang="less" scoped>
  .button-disabled {
    cursor: not-allowed;
  }
  .save-as-draft:focus{
    background: #fff;
    outline: none;
    border: 1px solid #dddddd;
  }
  .subheader-title{
    line-height:30px;
    color:#514960;
    position:relative;
    padding-left:10px;
    font-size: 18px;
    font-family: "Open Sans", Arial, sans-serif;
    font-weight: 300;
    margin-top: -1px;
  }
</style>

<style lang="less">
.modal-approved {
  .modal-body{
    margin: 0px;
    padding-top: 53px;
  }
}
</style>
