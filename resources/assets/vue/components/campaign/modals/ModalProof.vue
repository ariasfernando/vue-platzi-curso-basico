<template>
  <transition name="modal" v-if="modalProof">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <slot name="body">
              <h4>Who would you like to send this email to for review?</h4>
              <div class="send-proof">
                  <form name="send-proof-form" id="send-proof-form" action="/proof/create" @submit.prevent="send">
                      <input type="hidden" name="campaign_id" id="campaign_id" :value="campaign.campaign_id">
                      <input type="hidden" name="proof_id" id="proof_id" :value="campaign.campaign_data.proof_id">
                      <div class="form-group">
                          <div class="input-group">
                              <select name="proof_users" id="proof_users" data-live-search="true" class="proof-users-picker form-control">
                                <option v-bind:key="user.id" v-for="user in users" :value="user">{{user}}</option>
                              </select>
                              <span class="input-group-btn">
                                  <button type="button" class="btn btn-default btn-reviewer-add beta-btn-primary" @click="addReviewer">Add</button>
                              </span>
                          </div>
                      </div>
                      <table class="table table-condensed" id="reviewers-table">
                          <thead>
                              <tr>
                                <th class='col-xs-5'>Email</th>
                                <th class='col-xs-2'>Required approval</th>
                                <th class='col-xs-1'>Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(reviewer, key) in reviewers">
                                <td>
                                  <input type="hidden" :name="'reviewers[' + key + '][email]'"
                                    :value="reviewer.email">{{reviewer.email}}
                                </td>
                                <td>
                                  <input type="checkbox" :name="'reviewers[' + key + '][required]'"
                                    :checked="reviewer.checked"
                                    :value="reviewer.requiredValue"
                                    :disabled="reviewer.requiredDisable || false">
                                </td>
                                <td>
                                  <input type="hidden" :name="'reviewers[' + key + '][notification_message]'"
                                    :value="reviewer.notificationMessage" class="notification_message">
                                  <a href="#" class="add-message" title="Add a message" @click="addNotificationMessage(reviewer)">
                                      <i class="glyphicon glyphicon-envelope"></i></a>
                                  <a href="#" class="remove-reviewer" title="Remove this email" @click="removeReviewer(reviewer)">
                                      <i class="glyphicon glyphicon-remove"></i></a>
                                </td>
                            </tr>
                          </tbody>
                      </table>
                      <div class="checkbox new-proof-checkbox">
                        <div class="input-group">
                          <label data-toggle="tooltip" data-placement="top"
                            title="Existing comments, approvals, and rejections will be archived.">
                            <input type="checkbox" value="1" name="create_new_proof" v-model="startProof"> Start proof from scratch
                          </label>
                        </div>
                        <div class="input-group">
                          <label>
                            <input type="checkbox" value="1" name="send_to_all"> Send a notification to all reviewers
                          </label>
                        </div>
                      </div>
                  </form>
              </div>
              <div id="modal-proof-message" class="modal fade" tabindex="-2" role="dialog" aria-hidden="true">
                  <div class="modal-dialog modal-sm">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h4>Write a message</h4>
                      </div>
                      <div class="modal-body">
                        <div class="proof-add-message">
                          <input type="hidden" name="proof-current-row" id="proof-current-row" value="" />
                          <div class="form-group">
                            <textarea name="notification_message" id="notification_message" class="form-control"
                              rows="3" maxlength="200" v-model="currentNotificationMessage"></textarea>
                          </div>
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary btn-cancel beta-btn-secondary" @click="discardNotificationMessage">Cancel</button>
                        <button class="btn btn-default beta-btn-primary" id="btn-proof-message" @click="saveNotificationMessage">Add message</button>
                      </div>
                    </div>
                  </div>
              </div>
          </slot>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-default beta-btn-secondary" @click="close">Close</button>
              <button class="btn btn-default beta-btn-primary" id="btn-send-proof" @click="send">Submit</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import request from '../../../utils/request';
  import Q from 'q';

  // @TODO remove jQuery dependencies.
  $.ajaxSetup({
      headers: {
        'X-CSRF-token': Application.globals.csrfToken
      }
  });

  export default {
    computed: {
      modalProof () {
        return this.$store.state.campaign.modalProof;
      },
      campaign () {
        return this.$store.getters["campaign/campaign"];
      }
    },
    methods: {
      close () {
        this.$store.commit("campaign/toggleModal", 'modalProof');
      },
      send () {
        this.$store.commit("global/setLoader", true);

        let data = $(document.getElementById('send-proof-form')).serialize();

        let jqXHR = $.ajax('/proof/create', {
          method: 'post',
          data: data
        });

        jqXHR.done((response) => {
          this.$store.commit("global/setLoader", false);
          var $container = $('.modal-container').find('.send-proof');

          if (response.status === 'success') {
            // If the campaign can't be completed, hide the Continue button
            if ("can_be_completed" in response.data) {
              if (response.data.can_be_completed) {
                $('.campaign-continue').show();
              } else {
                $('.campaign-continue').hide();
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
        });

      },
      fetchUsers () {

        $.getJSON(this.$app.baseUrl + '/proof/users', {}, function(users) {
          this.users = users;
        }.bind(this));

        return this.users;
      },
      fetchReviewers () {

        $.getJSON(this.$app.baseUrl + '/proof/reviewers/' + this.campaign.campaign_data._id, {}, function(response) {

          if (response && response.status === 'success') {
              for (index in response.data) {
                this.addReviewer(response.data[index].email, response.data[index]);
              }
          }
        }.bind(this));

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
          email = $('#proof_users option:selected').text();
        }

        // Check if the email already exists in the table
        var check = $table.find('tr > td:contains(' + email + ')').length;

        if (!check) {

            // Set default params
            params = $.extend({
              required: '',
              notification_message: ''
            }, params );

            var requiredChecked = params.required ? 'checked="checked"' : '';
            var requiredValue = 1;
            var requiredDisable = false;
            var notification_message = params.notification_message || '';

            if ("require_unabled" in params) {
                requiredValue = 0;
                requiredDisable = 'disabled';
            }

            this.reviewers.push({
              email: email,
              checked: params.required ? 'checked' : '',
              requiredValue: requiredValue,
              requiredDisable: requiredDisable,
              notificationMessage: notification_message
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
              container.prepend(errorAlert).find(".alert").slideDown();
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
        this.currentNotificationMessage = this.currentReviewer.notificationMessage;
        $('#modal-proof-message').show();
        $('#notification_message').focus();
      },
      discardNotificationMessage () {
        $('#modal-proof-message').hide();
      },
      saveNotificationMessage () {
        this.currentReviewer.notificationMessage = $('#notification_message').val();
        $('#modal-proof-message').hide();
      }

    },
    created () {
      this.fetchUsers();
      this.fetchReviewers();

      if (this.campaign.campaign_data.proof_id) {
        this.startProof = false;
      }
    },
    updated () {
      if ($('.proof-users-picker').length) {
          $('.proof-users-picker').selectpicker();
      }
    },
    data: function() {
      return {
        users: [],
        reviewers: [],
        currentReviewer: {},
        currentNotificationMessage: '',
        startProof: true
      }
    },
  };
</script>

<style lang="less" scoped>
  .modal-container {
    width: 750px;

    textarea {
      width: 100%;
      height: 500px;
      border: 1px solid #ccc;
      font-family: monospace, serif;
    }
  }
  .btn-reviewer-add{
    margin-top: 0px;
  }
  #modal-proof-message {
    textarea {
      height: 200px;
    }
  }
</style>