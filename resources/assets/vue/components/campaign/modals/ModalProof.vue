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
                  <form name="send-proof-form" id="send-proof-form" action="">
                      <input type="hidden" name="campaign_id" value="">
                      <input type="hidden" name="proof_id" value="">
                      <div class="form-group">
                          <label>Name</label>
                          <div class="input-group">
                              <select name="proof_users" id="proof_users" data-live-search="true" class="proof-users-picker form-control">


                              </select>
                              <span class="input-group-btn">
                                  <button type="button" class="btn btn-default btn-reviewer-add">Add</button>
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
              <button class="btn btn-default" id="btn-send-proof">Submit</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
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
    },
    created () {

    }
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