<template>
  <transition name="modal" v-if="modalProofTrack">
    <div class="modal-mask modal-proof">
      <div class="modal-wrapper">
        <div class="modal-container scrolled">
          <button type="button" class="close" @click="close">
            <span>
              &times;
            </span>
          </button>
          <h4>
            Tracking
          </h4>
          <h5>
            Campaign: {{campaign.campaign_name}}
          </h5>
          <div class="modal-container-inner">
            <div class="send-proof">
                <table class="table table-condensed" id="reviewers-table">
                  <thead>
                    <tr>
                      <th class='col-xs-3'>
                        Email
                      </th>
                      <th class='col-xs-3'>
                        Status
                      </th>
                      <th class='col-xs-3'>
                        Last modified date
                      </th>
                      <th class='col-xs-3'>
                        Comment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(reviewer, key) in reviewers" v-bind:key="key">
                      <td :style="reviewer.required ? 'font-weight:bold;' : ''">
                        {{reviewer.email}}
                      </td>
                      <td>
                        {{reviewer.decision}}
                      </td>
                      <td>
                        {{reviewer.last_modified_date}}
                      </td>
                      <td>
                        <div class='addReadMore' @click='toggleComment(key)' :class="reviewer.comment_is_open ? 'showmorecontent' : 'showlesscontent'" v-html="reviewer.comment">
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default beta-btn-secondary" @click="close">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import request from '../../../utils/request';
  import Q from 'q';
  import proofService from '../../../services/proof';
  export default {
    computed: {
      modalProofTrack () {
        return this.$store.state.campaign.modalProofTrack;
      },
      campaign () {
        return this.$store.getters['campaign/campaign'];
      }
    },
    watch: {
      modalProofTrack (value) {
        if (value) {
          this.checkCampaign();
          this.fetchReviewers();
        }
      }
    },
    methods: {
      close () {
        this.reviewers = [];
        this.$store.commit('campaign/toggleModal', 'modalProofTrack');
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
            response.data.map((reviewer, index) => {
              let decision = 'Waiting for approval';
              //Decision
              if ("decision" in reviewer) {
                switch (reviewer.decision) {
                    case 'approve':
                    case 'approve-with-comments':
                        decision = 'Approved';
                        break;
                    case 'reject':
                    case 'reject-with-comments':
                        decision = 'Rejected';
                        break;
                }
              }
              response.data[index].decision = decision;
              //Comment
              const charLimit = 200;
              if ("comment" in reviewer) {
                if (reviewer.comment.length > charLimit) {
                  const readMoreTxt = " ... Read More";
                  const readLessTxt = " Read Less";
                  let firstSet = reviewer.comment.substring(0, charLimit);
                  let secdHalf = reviewer.comment.substring(charLimit, reviewer.comment.length);
                  let comment = firstSet + "<span class='SecSec'>" + secdHalf + "</span><span class='readMore' title='Click to Show More'>" + readMoreTxt + "</span><span class='readLess' title='Click to Show Less'>" + readLessTxt + "</span>";
                  response.data[index].comment = comment;
                  response.data[index].comment_is_open = false;
                }
              }
            });
            this.reviewers = response.data;
          }
        })
        .catch((error) => {
          this.$root.$toast(error, {className: 'et-error'});
        });
        return this.reviewers;
      },
      toggleComment (index) {
        this.reviewers[index].comment_is_open = !this.reviewers[index].comment_is_open;
      },
    },
    data () {
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
  .scrolled{
    max-height: 85vh;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    .table tbody tr td{
      vertical-align: top !important;
    }
  }
  .addReadMore.showlesscontent {
    .SecSec,
    .readLess {
      display: none;
    }
  }
  .addReadMore.showmorecontent {
    .readMore {
      display: none;
    }
  }
  .addReadMore {
    .readMore,
    .readLess {
      &:hover {
        color:#9086a3;
      }
      font-weight: bold;
      margin-left: 2px;
      color: #aaa3b9;
      cursor: pointer;
    }
  }
  .addReadMoreWrapTxt.showmorecontent {
    .readLess,
    .SecSec {
      display: block;
    }
  }
</style>
