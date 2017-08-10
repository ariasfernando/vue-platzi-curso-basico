<template>
  <transition name="modal" v-if="modalProof">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              <h4>Who would you like to send this email to for review?</h4>
            </slot>
          </div>
          <slot name="body">
              <div class="send-proof">
                  <form name="send-proof-form" id="send-proof-form" action="/proof/create" @submit.prevent="send">
                      <input type="hidden" name="campaign_id" id="campaign_id" value="">
                      <input type="hidden" name="proof_id" value="">
                      <div class="form-group">
                          <label>Name</label>
                          <div class="input-group">
                              <select name="proof_users" id="proof_users" data-live-search="true" class="proof-users-picker form-control">
                                <option v-bind:key="user.id" v-for="user in users" :value="user">{{user}}</option>
                              </select>
                              <span class="input-group-btn">
                                  <button type="button" class="btn btn-default btn-reviewer-add" @click="addReviewer">Add</button>
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
                          <tbody></tbody>
                      </table>
                      <div class="checkbox new-proof-checkbox">
                          <div class="input-group">
                              <label data-toggle="tooltip" data-placement="top"
                                  title="Existing comments, approvals, and rejections will be archived.">
                                  <input type="checkbox" value="1" name="create_new_proof"> Start proof from scratch
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
                                          rows="3" maxlength="200"></textarea>
                                  </div>
                              </div>
                          </div>
                          <div class="modal-footer">
                          </div>
                      </div>
                  </div>
              </div>
          </slot>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-default" @click="close">Close</button>
              <button class="btn btn-default" id="btn-send-proof" @click="send">Submit</button>
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
        return this.$store.state.campaign.campaign;
      }
    },
    methods: {
      close () {
        this.$store.commit("campaign/toggleModal", 'modalProof');
      },
      send () {
        let bodyHtml = document.getElementsByClassName('section-canvas-container')[0].innerHTML;
        this.$store.commit("global/setLoader", true);
        this.$store.dispatch("campaign/saveCampaign", {
          campaign: this.campaign,
          bodyHtml
        }).then(response => {
          this.$store.commit("global/setLoader", false);

          $('#campaign_id').val(this.campaign.campaign_id);
          var data = $(document.getElementById('send-proof-form')).serialize();

          var jqXHR = $.ajax('/proof/create', {
            method: 'post',
            data: data
          });

          jqXHR.done(function(response){

          });

        });
      },
      fetchUsers () {

        $.getJSON('/proof/users', {}, function(users) {
          this.users = users;
        }.bind(this));

        return this.users;
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
              var i = $table.find('tr:last').data('row') + 1 || 0;

              // Set default params
              params = $.extend({
                  required: '',
                  notification_message: ''
              }, params );

              var requiredChecked = params.required ? 'checked="checked"' : '';
              var requiredValue = ' value="1"';
              var requiredDisable = '';
              var notification_message = params.notification_message || '';

              if ("require_unabled" in params) {
                  requiredValue = ' value="0"';
                  requiredDisable = ' disabled="disabled"';
              }

              var html = '' +
                  '<tr data-row="' + i + '">' +
                      '<td>' +
                          '<input type="hidden" name="reviewers[' + i + '][email]" value="' + email + '">' +
                          email +
                      '</td>' +
                      '<td>' +
                          '<input type="checkbox" name="reviewers[' + i + '][required]"' + requiredChecked +
                              requiredValue + requiredDisable + '>' +
                      '</td>' +
                      '<td>' +
                          '<input type="hidden" name="reviewers[' + i + '][notification_message]" value="'
                            + notification_message + '" class="notification_message">' +
                          '<a href="#" class="add-message" title="Add a message">' +
                              '<i class="glyphicon glyphicon-envelope"></i></a>' +
                          '<a href="#" class="remove-reviewer" title="Remove this email">' +
                              '<i class="glyphicon glyphicon-remove"></i></a>' +
                      '</td>' +
                  '</tr>';
              $table.append(html);// tbody?
          } else {
              // The email already exists in the table
              var $container = $('.modal-container').find('.send-proof');
              this.showMessage($container, 'danger', 'This email already exists on the list.');
          }
      },
      /**
      * Remove a reviewer from the table
      *
      * @param  {object} elem
      * @return {void}
      */
      removeReviewer: function( elem ) {
          if (confirm('Are you sure you want to remove this email?')) {
              $(elem).closest("tr").remove();
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
      showMessage: function( container, status, message, delay ) {
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
      }


    },
    created () {
      this.fetchUsers();
    },
    data: function() {
      return {
        users: []
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
</style>