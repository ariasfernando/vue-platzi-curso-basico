<template>
  <transition name="modal" v-if="modalProof">
    <div class="modal-mask modal-proof">
      <div class="modal-wrapper">
        <div class="modal-container">
          <button type="button" class="close" @click="close">
            <span>
              &times;
            </span>
          </button>
          <h4>
            Who would you like to send this email to for review?
          </h4>
          <h5>
            Campaign: {{campaign.campaign_name}}
          </h5>
          <div class="modal-container-inner">
            <div class="send-proof">
              <form name="send-proof-form" id="send-proof-form" action="/proof/create" @submit.prevent="send">
                <div class="form-group">
                  <div class="input-group">
                    <select name="proof_users" id="proof_users" data-live-search="true" class="proof-users-picker form-control">
                      <option v-bind:key="user.id" v-for="user in users" :value="user">
                        {{user}}
                      </option>
                    </select>
                    <span class="input-group-btn">
                      <button type="button" class="btn btn-default btn-reviewer-add beta-btn-primary" @click="addReviewer">
                        Add
                      </button>
                    </span>
                  </div>
                </div>
                <div class="modal-divider"></div>
                <table class="table table-condensed" id="reviewers-table">
                  <thead>
                    <tr>
                      <th class='col-xs-5'>
                        Email
                      </th>
                      <th class='col-xs-2'>
                        Approval Required?
                      </th>
                      <th class='col-xs-1'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(reviewer, key) in reviewers" v-bind:key="key">
                      <td>
                        {{reviewer.email}}
                      </td>
                      <td>
                        <checkbox :disabled="reviewer.require_unabled || false" :name="'reviewers[' + key + '][required]'" v-model="reviewer.required"></checkbox>
                      </td>
                      <td>
                        <a href="#" class="add-message" title="Add a message" @click="addNotificationMessage(reviewer)">
                          <i class="glyphicon glyphicon-envelope"  v-bind:class="{ containMessage: reviewer.notification_message }" ></i>
                        </a>
                        <a href="#" class="remove-reviewer" title="Remove this email" @click="removeReviewer(reviewer)">
                          <i class="glyphicon glyphicon-remove"></i>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="modal-divider" v-show="campaignData.proof_id !== null"></div>
                <div class="checkbox new-proof-checkbox" v-show="campaignData.proof_id !== null">
                  <div class="input-group">
                    <label data-toggle="tooltip" data-placement="top" title="Selecting this option will archive the previously collected approvals, rejections, and comments. It will effectively start the approval process over from the beginning">
                      <checkbox name="create_new_proof" value="1" v-model="startProof">
                        Start proof from scratch
                      </checkbox>
                    </label>
                  </div>
                  <div class="input-group">
                    <label data-toggle="tooltip" data-placement="top" title="Selecting this option will trigger the review request email to all reviewers, even if they had already received it as part of an earlier request. Leaving it unchecked will send the email only to newly added or edited users">
                      <checkbox name="send_to_all" value="1">
                        Send a notification to all reviewers
                      </checkbox>
                    </label>
                  </div>
                </div>
              </form>
            </div>
            <div id="modal-proof-message" class="modal fade" tabindex="-2" role="dialog" aria-hidden="true">
              <div class="modal-dialog modal-sm">
                <div class="modal-content">
                  <div class="modal-header">
                    <h4>
                      Write a message
                    </h4>
                  </div>
                  <div class="modal-body">
                    <div class="proof-add-message">
                      <div class="form-group">
                        <textarea name="notification_message" id="notification_message" class="form-control" rows="3" maxlength="200" v-model="currentNotificationMessage"></textarea>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-primary btn-cancel beta-btn-secondary" @click="discardNotificationMessage">
                      Cancel
                    </button>
                    <button class="btn btn-default beta-btn-primary" id="btn-proof-message" @click="saveNotificationMessage">
                      Add message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default beta-btn-secondary" @click="close">
              Close
            </button>
            <button class="btn btn-default beta-btn-primary" :class="{'disabled': reviewers.length === 0}" :disabled="reviewers.length === 0" id="btn-send-proof" @click="send">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<style lang="less">
  .containMessage {
    color: green
  }
</style>
<script>
  import request from '../../../utils/request';
  import Q from 'q';
  import { Checkbox } from 'vue-checkbox-radio';
  import proofService from '../../../services/proof';
  export default {
    components: {
      Checkbox
    },
    computed: {
      modalProof () {
        return this.$store.state.campaign.modalProof;
      },
      campaign () {
        return this.$store.getters['campaign/campaign'];
      }
    },
    watch: {
      modalProof (value) {
        if (value) {
          this.checkCampaign();
          this.fetchReviewers();
        }
      }
    },
    methods: {
      close () {
        this.reviewers = [];
        this.$store.commit('campaign/toggleModal', 'modalProof');
      },
      send () {
        this.$store.commit('global/setLoader', true);

        let data = {
          campaign_id: this.campaign.campaign_id,
          reviewers: this.reviewers,
        }
        if(!this.campaign.campaign_data.proof_id || this.startProof){
          data.create_new_proof = true;
        }
        if(this.campaign.campaign_data.proof_id){
          data.proof_id = this.campaign.campaign_data.proof_id;
        }

        proofService.create(data).then((response) => {
          this.$store.commit('global/setLoader', false);
          var $container = $('.modal-container').find('.send-proof');
          if (response.status === 'success') {
            // If the campaign can't be completed, hide the Continue button
            if ('can_be_completed' in response.data) {
              if (response.data.can_be_completed) {
                this.$store.commit('campaign/campaignCanBeProcessed', true);
              } else {
                this.$store.commit('campaign/campaignCanBeProcessed', false);
              }
            }
            this.close();
            this.$root.$toast(
              'Success! ' + response.message,
              {className: 'et-success'}
            );
          } else {
            this.showMessage($container, 'danger', response.message);
          }
        })
        .catch((error) => {
          this.$root.$toast(error, {className: 'et-error'});
        });
      },
      fetchUsers () {
        proofService.getJSON('users').then((response) => {
          if (response.status === 'success') {
            this.users = response.data? response.data.sort() : {};
          } else {
            this.showMessage($container, 'danger', response.message);
          }
        })
        .catch((error) => {
          this.$root.$toast(error, {className: 'et-error'});
        });
        return this.users;
      },
      checkCampaign () {
        proofService.getJSON('campaign', this.campaign.campaign_data._id).then((response) => {
          if (response.status === 'success') {
            this.campaignData = response.data;
            if (this.campaignData.proof_id !== null) {
              // If a proof already exists, set the 'Start proof from scratch' off
              this.startProof = false;
            }
            if ('can_be_processed' in this.campaignData && this.campaignData.can_be_processed === false) {
              this.$root.$toast(
                this.campaignData.alert,
                {className: 'et-info'}
              );
              this.$store.commit('campaign/campaignCanBeProcessed', false);
            }
          }
        })
        .catch((error) => {
          this.$root.$toast(error, {className: 'et-error'});
        });
      },
      fetchReviewers () {
        proofService.getJSON('reviewers', this.campaign.campaign_data._id).then((response) => {
          if (response && response.status === 'success') {
              this.reviewers = response.data;
          }
        })
        .catch((error) => {
          this.$root.$toast(error, {className: 'et-error'});
        });
        return this.reviewers;
      },

      /**
       * Add a reviewer in the table
       *
       * @param  {string} email
       * @param  {array}  params
       * @return {void}
       */
      addReviewer: function(email, params) {
        var $table = this.getReviewersTable();

        if (typeof email === 'object') {
          email = $('#proof_users option:selected').text().trim();
        }

        // Check if the email already exists in the table
        var check = $table.find('tr > td:contains(' + email + ')').length;

        if (!check) {

            // Set default params
            params = $.extend({
              required: '',
              notification_message: ''
            }, params );

            var requiredValue = 0;
            var requiredDisable = false;
            var notification_message = params.notification_message || '';

            if ('require_unabled' in params && params.require_unabled) {
                requiredValue = 0;
                requiredDisable = true;
            }

            this.reviewers.push({
              email: email,
              checked: params.required ? true : false,
              required: requiredValue,
              require_unabled: requiredDisable,
              notification_message: notification_message
            });

        } else {
            // The email already exists in the table
            var $container = $('.modal-container').find('.send-proof');
            this.showMessage($container, 'danger', 'This email already exists on the list.');
        }
      },

      /**
      * Remove a reviewer from the table
      *
      * @param  {object} reviewer
      * @return {void}
      */
      removeReviewer: function(reviewer) {
          if (confirm('Are you sure you want to remove this email?')) {
              let index = this.reviewers.indexOf(reviewer);
              this.reviewers.splice(index, 1);
          }
      },

      /**
       * Return reviewers table element
       *
       * @return {object}
       */
      getReviewersTable: function() {
          return $('.modal-container').find('#reviewers-table tbody');
      },

      /**
       * Show a message inside the modal
       *
       * @param  {object}  container
       * @param  {string}  status
       * @param  {string}  message
       * @param  {integer} delay
       * @return {void}
       */
      showMessage: function(container, status, message, delay) {
          var errorAlert = '<div class="alert alert-' + status + '" role="alert" style="display:none;">'
            + message + '</div>';

          // First remove any previous alert
          $('.modal-container').find('.alert:hidden').remove();

          // Show if not exist a visible alert
          if (!container.find('.alert').length) {
              container.prepend(errorAlert).find('.alert').slideDown();
              setTimeout(function() {
                  container.find('.alert')
                      .slideUp('normal', function() {
                          $(this).remove();
                      });
              }, delay || 4000);
          }
      },
      addNotificationMessage (reviewer) {

        $('#modal-proof-message').removeClass('fade');
        this.currentReviewer = reviewer;
        this.currentNotificationMessage = this.currentReviewer.notification_message;
        $('#modal-proof-message').show();
        $('#notification_message').focus();
      },
      discardNotificationMessage () {
        $('#modal-proof-message').hide();
      },
      saveNotificationMessage () {
        this.currentReviewer.notification_message = $('#notification_message').val();
        $('#modal-proof-message').hide();
      }

    },
    created () {
      if (!this.proofAccess.status || !this.proofAccess.allow) {
        return;
      }

      this.fetchUsers();
    },
    updated () {
      if ($('.proof-users-picker').length) {
          $('.proof-users-picker').selectpicker();
      }
    },
    data: function() {
      return {
        campaignData: {},
        users: [],
        reviewers: [],
        currentReviewer: {},
        currentNotificationMessage: '',
        startProof: true,
        proofAccess: {
          status: this.$_app.config.proofConfig.status,
          allow: this.$_app.config.permissions.indexOf('edit_proof') >= 0
            && this.$_app.config.permissions.indexOf('access_proof') >= 0
        }
      }
    },
  };
</script>

<style lang="less">
  .dropdown-menu {
    .open {
      overflow-y: scroll !important;
      width: 100%;
    }
  }
</style>
